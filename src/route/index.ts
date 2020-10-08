import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CurveFromGPS } from "./curveFromGPS";
import { hrColorPicker } from "./hrColorPicker";
import type { IZoneData } from "../services/getZones";

// Sets Z axis to UP
THREE.Object3D.DefaultUp.set(0, 0, 1);

const FOV = 40;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x444444);
const camera = new THREE.PerspectiveCamera(
  FOV,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);

const ambientLight = new THREE.AmbientLight(0x404040);
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
orbit.autoRotate = false;

const hrData = [
  { value: 0, color: new THREE.Color(0x0000ff) },
  { value: 0, color: new THREE.Color(0x00ff00) },
  { value: 0, color: new THREE.Color(0xffff00) },
  { value: 0, color: new THREE.Color(0xffa500) },
  { value: 0, color: new THREE.Color(0xff0000) },
];

let mesh: THREE.Mesh;

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

export const renderRoute = (data: IData): void => {
  if (mesh) {
    scene.remove(mesh);
  }
  const hrPicker = hrColorPicker(hrData, data.heartrate.data);

  const FACES_PER_SEGMENT = 16;
  const setGradient = (geometry: THREE.Geometry): void => {
    const faceCount = geometry.faces.length;
    const segmentCount = faceCount / FACES_PER_SEGMENT;
    for (let i = 0; i < faceCount; ++i) {
      const color = hrPicker(
        Math.floor((i / FACES_PER_SEGMENT) % faceCount) / segmentCount
      );
      geometry.faces[i].color = color;
    }
  };

  const curve = new CurveFromGPS(data.latlng.data, data.altitude.data);
  const geometry = new THREE.TubeGeometry(
    curve,
    5000,
    1,
    FACES_PER_SEGMENT / 2,
    false
  );
  const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    flatShading: true,
    vertexColors: true,
  });

  const objectSize = Math.max(curve.width, curve.height);
  const distance = Math.abs(objectSize / Math.sin(FOV / 2));

  camera.position.y = -distance;
  camera.position.z = distance / 4;

  setGradient(geometry);

  mesh = new THREE.Mesh(geometry, material);
  // scene.add(mesh);

  const SEGMENT_WIDTH = 1;

  const drawSegment = (length, z1, z2, color): THREE.Group => {
    const group = new THREE.Group();

    const side = new THREE.Shape()
      .moveTo(0, 0)
      .lineTo(length, 0)
      .lineTo(length, z2)
      .lineTo(0, z1)
      .lineTo(0, 0);

    const pointHeightDiff = Math.abs(z2 - z1);
    const topLength = Math.sqrt(
      Math.pow(length, 2) + Math.pow(pointHeightDiff, 2)
    );

    const top = new THREE.Shape()
      .moveTo(0, 0)
      .lineTo(topLength, 0)
      .lineTo(topLength, SEGMENT_WIDTH)
      .lineTo(0, SEGMENT_WIDTH)
      .lineTo(0, 0);
    const topAngle = Math.atan(pointHeightDiff / length);

    const sideGeometry = new THREE.ShapeBufferGeometry(side);
    const sideMesh = new THREE.Mesh(
      sideGeometry,
      new THREE.MeshPhongMaterial({ color, side: THREE.DoubleSide })
    );
    const sideBMesh = sideMesh.clone();
    sideMesh.position.set(0, 0, 0);
    sideMesh.rotation.set(Math.PI / 2, 0, 0);
    group.add(sideMesh);

    sideBMesh.position.set(0, SEGMENT_WIDTH, 0);
    sideBMesh.rotation.set(Math.PI / 2, 0, 0);
    group.add(sideBMesh);

    const topGeometry = new THREE.ShapeBufferGeometry(top);
    const topMesh = new THREE.Mesh(
      topGeometry,
      new THREE.MeshPhongMaterial({ color, side: THREE.DoubleSide })
    );
    topMesh.position.set(0, 0, z1);
    topMesh.rotation.set(0, (z1 > z2 ? 1 : -1) * topAngle, 0);
    group.add(topMesh);

    group.position.set(-length, -SEGMENT_WIDTH / 2, 0);

    return group;
  };

  const points = [
    { x: 0, y: 0, z: 5, color: 0xff0000 },
    { x: 1, y: 0, z: 6, color: 0x00ff00 },
    { x: 2, y: 0, z: 6, color: 0x0000ff },
    { x: 4, y: 0, z: 5, color: 0xff0000 },
    { x: 4, y: 5, z: 5, color: 0x00ff00 },
    { x: 6, y: 5, z: 3, color: 0x0000ff },
  ];

  for (let i = 1; i < points.length; ++i) {
    const pointA = points[i - 1];
    const pointB = points[i];
    const x = pointB.x - pointA.x;
    const y = pointB.y - pointA.y;
    const segmentLength = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    const color = new THREE.Color(pointB.color);
    const segment = drawSegment(segmentLength, pointA.z, pointB.z, color);

    const group = new THREE.Group();
    group.position.set(pointB.x, pointB.y, 0);
    group.rotation.set(0, 0, Math.atan(y / x));
    group.add(segment);

    scene.add(group);
  }

  var gridHelper = new THREE.GridHelper(100, 21);
  gridHelper.rotateX(Math.PI / 2);
  scene.add(gridHelper);
};
