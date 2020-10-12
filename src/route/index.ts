import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { colorFromValue } from "./hrColorPicker";
import type { IZoneData } from "../services/getZones";
import { buildFlag } from "./buildFlag";
import { buildSegment } from "./buildSegment";
import { positionSegment } from "./positionSegment";
import { getPositions } from "./getPositions";
import type { IActivity } from "../services/getActivity";

// Sets Z axis to UP
THREE.Object3D.DefaultUp.set(0, 0, 1);

const GRID_EXTENSION = 1.05;
const GRID_DIVISIONS = 11;
const DATA_SIZE_LIMIT = 4000;

const FOV = 40;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x444444);
const camera = new THREE.PerspectiveCamera(
  FOV,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);

const ambientLight = new THREE.AmbientLight(0x808080);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.85);
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer();

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableZoom = true;
orbit.enablePan = true;
orbit.autoRotate = true;

const hrData = [
  { value: 0, color: new THREE.Color(0x0000ff) },
  { value: 0, color: new THREE.Color(0x00ff00) },
  { value: 0, color: new THREE.Color(0xffff00) },
  { value: 0, color: new THREE.Color(0xffa500) },
  { value: 0, color: new THREE.Color(0xff0000) },
];

let route: THREE.Group;
let gridHelper: THREE.GridHelper;
const meshes: THREE.Mesh[] = [];

export const setup = (container: HTMLElement): void => {
  camera.aspect = container.offsetWidth / container.offsetHeight;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);

  window.onresize = () => {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
  };

  const render = () => {
    renderer.render(scene, camera);
    orbit.update();
    requestAnimationFrame(render);
  };
  render();
};

export const setHeartRateData = (data: IZoneData): void => {
  data.zones.forEach((zone, index) => {
    hrData[index].value = zone.min;
  });
};

const cleanUp = (): void => {
  meshes.forEach((object) => {
    [].concat(object.material).forEach((material) => material.dispose());
    object.geometry.dispose();
  });
  meshes.length = 0;
  renderer.renderLists.dispose();
};

export const renderRoute = (data: IActivity): void => {
  if (route) {
    scene.remove(route);
  }
  if (gridHelper) {
    scene.remove(gridHelper);
  }

  cleanUp();

  route = new THREE.Group();
  const dataPoints = data.distance.data.length;
  const skip = Math.ceil(dataPoints / DATA_SIZE_LIMIT);
  const positionData = getPositions(
    dataPoints,
    data.latlng?.data,
    data.altitude?.data
  );
  const sortedSteps = hrData.sort((a, b) => a.value - b.value);

  const startPosition = positionData.positions[0];
  const start = buildFlag(
    startPosition.x,
    startPosition.y,
    startPosition.z,
    0x00ff00
  );
  meshes.push(start);
  route.add(start);

  for (let i = skip; i < positionData.positions.length; i += skip) {
    const from = positionData.positions[i - skip];
    const to = positionData.positions[i];
    const xDiff = to.x - from.x;
    const yDiff = to.y - from.y;

    const segmentLength = Math.sqrt(xDiff ** 2 + yDiff ** 2);
    const color = colorFromValue(
      sortedSteps,
      (data.heartrate.data[i - 1] + data.heartrate.data[i]) / 2
    );
    const segment = buildSegment(segmentLength, from.z, to.z, color);
    const positionedSegment = positionSegment(
      segment,
      to.x,
      to.y,
      yDiff,
      xDiff
    );
    meshes.push(segment);

    route.add(positionedSegment);
  }

  const endPosition = positionData.positions[positionData.positions.length - 1];
  const end = buildFlag(endPosition.x, endPosition.y, endPosition.z, 0xff0000);
  meshes.push(end);
  route.add(end);

  scene.add(route);

  const gridSize = positionData.size * GRID_EXTENSION;
  gridHelper = new THREE.GridHelper(gridSize, GRID_DIVISIONS);
  gridHelper.rotateX(Math.PI / 2);
  scene.add(gridHelper);

  const distance = Math.abs(positionData.size / Math.sin(FOV / 2));

  orbit.reset();
  camera.position.y = -distance;
  camera.position.z = distance / 4;
};
