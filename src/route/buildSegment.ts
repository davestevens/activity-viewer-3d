import {
  Shape,
  ShapeBufferGeometry,
  Mesh,
  MeshPhongMaterial,
  DoubleSide,
  Color,
} from "three";

export const buildSegment = (
  length: number,
  z1: number,
  z2: number,
  color: number | Color
): Mesh => {
  const shape = new Shape()
    .moveTo(0, 0)
    .lineTo(length, 0)
    .lineTo(length, z2)
    .lineTo(0, z1)
    .lineTo(0, 0);

  const sideGeometry = new ShapeBufferGeometry(shape);
  const mesh = new Mesh(
    sideGeometry,
    new MeshPhongMaterial({ color, side: DoubleSide })
  );
  mesh.rotation.set(Math.PI / 2, 0, 0);
  mesh.position.set(-length, 0, 0);
  return mesh;
};
