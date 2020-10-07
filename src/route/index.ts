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

  var point1Height = 5;
  var point2Height = 7;
  var sectionLength = 10;
  var width = 6;

  var side1 = new THREE.Shape()
    .moveTo(0, 0)
    .lineTo(sectionLength, 0)
    .lineTo(sectionLength, point2Height)
    .lineTo(0, point1Height)
    .lineTo(0, 0);

  var side2 = new THREE.Shape()
    .moveTo(0, 0)
    .lineTo(sectionLength, 0)
    .lineTo(sectionLength, point2Height)
    .lineTo(0, point1Height)
    .lineTo(0, 0);

  var pointHeightDiff = Math.abs(point2Height - point1Height);
  var topLength = Math.sqrt(
    Math.pow(sectionLength, 2) + Math.pow(pointHeightDiff, 2)
  );
  var top = new THREE.Shape()
    .moveTo(0, 0)
    .lineTo(topLength, 0)
    .lineTo(topLength, width)
    .lineTo(0, width)
    .lineTo(0, 0);
  var topAngle = Math.atan(pointHeightDiff / sectionLength);

  {
    var group = new THREE.Group();

    var geometry1 = new THREE.ShapeBufferGeometry(side1);
    var mesh1 = new THREE.Mesh(
      geometry1,
      new THREE.MeshPhongMaterial({ color: 0xff0000, side: THREE.DoubleSide })
    );
    mesh1.position.set(0, 0, 0);
    mesh1.rotation.set(Math.PI / 2, 0, 0);
    group.add(mesh1);

    var geometry2 = new THREE.ShapeBufferGeometry(side2);
    var mesh2 = new THREE.Mesh(
      geometry2,
      new THREE.MeshPhongMaterial({ color: 0xff0000, side: THREE.DoubleSide })
    );
    mesh2.position.set(0, width, 0);
    mesh2.rotation.set(Math.PI / 2, 0, 0);
    group.add(mesh2);

    var geometry3 = new THREE.ShapeBufferGeometry(top);
    var mesh3 = new THREE.Mesh(
      geometry3,
      new THREE.MeshPhongMaterial({ color: 0xff0000, side: THREE.DoubleSide })
    );
    mesh3.position.set(0, 0, point1Height);
    mesh3.rotation.set(0, (point1Height > point2Height ? 1 : -1) * topAngle, 0);
    group.add(mesh3);

    // group.position.set(10, 10, 10);
    scene.add(group);
  }

  var gridHelper = new THREE.GridHelper(100, 21);
  gridHelper.rotateX(Math.PI / 2);
  scene.add(gridHelper);
};
