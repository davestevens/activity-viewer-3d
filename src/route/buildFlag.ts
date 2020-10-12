import { CylinderGeometry, MeshBasicMaterial, Mesh, Color } from "three";

export const buildFlag = (
  x: number,
  y: number,
  z: number,
  color: number | Color
): Mesh => {
  const geometry = new CylinderGeometry(0.2, 0.2, z, 32);
  const material = new MeshBasicMaterial({ color });
  const mesh = new Mesh(geometry, material);
  mesh.position.set(x, y, z / 2);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  return mesh;
};
