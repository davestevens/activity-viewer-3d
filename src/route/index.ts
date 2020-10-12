import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { colorFromValue } from "./hrColorPicker";
import type { IZoneData } from "../services/getZones";
import { convertLatLngToPosition } from "./convertLatLngToPosition";

// Sets Z axis to UP
THREE.Object3D.DefaultUp.set(0, 0, 1);

const BASE_HEIGHT = 5;
const GRID_EXTENSION = 1.05;
const GRID_DIVISIONS = 11;

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

interface IData {
  latlng: {
    data: number[][];
  };
  altitude: {
    data: number[];
  };
  heartrate: {
    data: number[];
  };
  velocity_smooth: {
    data: number[];
  };
}

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

export const renderRoute = (data: IData): void => {
  if (route) {
    scene.remove(route);
  }
  if (gridHelper) {
    scene.remove(gridHelper);
  }

  cleanUp();

  const buildSegment = (length, z1, z2, color): THREE.Mesh => {
    const side = new THREE.Shape()
      .moveTo(0, 0)
      .lineTo(length, 0)
      .lineTo(length, z2)
      .lineTo(0, z1)
      .lineTo(0, 0);

    const sideGeometry = new THREE.ShapeBufferGeometry(side);
    const mesh = new THREE.Mesh(
      sideGeometry,
      new THREE.MeshPhongMaterial({ color, side: THREE.DoubleSide })
    );
    mesh.rotation.set(Math.PI / 2, 0, 0);
    mesh.position.set(-length, 0, 0);
    return mesh;
  };

  const buildFlag = (
    x: number,
    y: number,
    z: number,
    color: number
  ): THREE.Mesh => {
    const geometry = new THREE.CylinderGeometry(0.2, 0.2, z, 32);
    const material = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z / 2);
    mesh.rotation.set(Math.PI / 2, 0, 0);
    return mesh;
  };

  const calculateAngle = (x: number, y: number): number => {
    if (x > 0) {
      if (y > 0) {
        return Math.atan(Math.abs(x) / Math.abs(y));
      } else if (y < 0) {
        return Math.PI / 2 + Math.atan(Math.abs(y) / Math.abs(x));
      } else {
        return Math.PI / 2;
      }
    } else if (x < 0) {
      if (y > 0) {
        return -Math.atan(Math.abs(x) / Math.abs(y));
      } else if (y < 0) {
        return -(Math.PI / 2 + Math.atan(Math.abs(y) / Math.abs(x)));
      } else {
        return -Math.PI / 2;
      }
    } else {
      if (y > 0) {
        return 0;
      } else if (y < 0) {
        return -Math.PI;
      } else {
        return 0;
      }
    }
  };

  const positionSegment = (
    segment: THREE.Object3D,
    x: number,
    y: number,
    xDiff: number,
    yDiff: number
  ): THREE.Group => {
    const group = new THREE.Group();
    group.position.set(x, y, 0);
    const angle = calculateAngle(xDiff, yDiff);
    group.rotation.set(0, 0, angle);
    group.add(segment);
    return group;
  };

  route = new THREE.Group();
  const positionData = convertLatLngToPosition(
    data.latlng.data,
    data.altitude.data
  );
  const sortedSteps = hrData.sort((a, b) => a.value - b.value);
  const xOffset = 0 - positionData.xLimits.diff / 2;
  const yOffset = 0 - positionData.yLimits.diff / 2;

  const startPosition = positionData.positions[0];
  const start = buildFlag(
    startPosition.x + xOffset,
    startPosition.y + yOffset,
    startPosition.z + BASE_HEIGHT,
    0x00ff00
  );
  meshes.push(start);
  route.add(start);

  for (let i = 1; i < positionData.positions.length; ++i) {
    const from = positionData.positions[i - 1];
    const fromX = from.x + xOffset;
    const fromY = from.y + yOffset;
    const to = positionData.positions[i];
    const toX = to.x + xOffset;
    const toY = to.y + yOffset;

    const xDiff = toX - fromX;
    const yDiff = toY - fromY;
    const segmentLength = Math.sqrt(xDiff ** 2 + yDiff ** 2);
    const color = colorFromValue(
      sortedSteps,
      (data.heartrate.data[i - 1] + data.heartrate.data[i]) / 2
    );
    const segment = buildSegment(
      segmentLength,
      from.z + BASE_HEIGHT,
      to.z + BASE_HEIGHT,
      color
    );
    meshes.push(segment);
    const positionedSegment = positionSegment(segment, toX, toY, yDiff, xDiff);

    route.add(positionedSegment);
  }

  const endPosition = positionData.positions[positionData.positions.length - 1];
  const end = buildFlag(
    endPosition.x + xOffset,
    endPosition.y + yOffset,
    endPosition.z + BASE_HEIGHT,
    0xff0000
  );
  meshes.push(end);
  route.add(end);

  scene.add(route);

  const gridSize =
    Math.max(positionData.xLimits.diff, positionData.yLimits.diff) *
    GRID_EXTENSION;
  gridHelper = new THREE.GridHelper(gridSize, GRID_DIVISIONS);
  gridHelper.rotateX(Math.PI / 2);
  scene.add(gridHelper);

  const objectSize = Math.max(
    positionData.xLimits.diff,
    positionData.yLimits.diff
  );
  const distance = Math.abs(objectSize / Math.sin(FOV / 2));

  orbit.reset();
  camera.position.y = -distance;
  camera.position.z = distance / 4;
};
