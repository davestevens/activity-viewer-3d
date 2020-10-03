import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CurveFromGPS } from "./curveFromGPS";
import { hrColorPicker } from "./hrColorPicker";

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
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

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
  { value: 112, color: new THREE.Color(0x00ff00) },
  { value: 149, color: new THREE.Color(0xffff00) },
  { value: 167, color: new THREE.Color(0xffa500) },
  { value: 186, color: new THREE.Color(0xff0000) },
];

export const renderRoute = (data: IData): void => {
  document.body.appendChild(renderer.domElement);
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

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const render = () => {
    renderer.render(scene, camera);
    orbit.update();
    requestAnimationFrame(render);
  };
  render();
};
