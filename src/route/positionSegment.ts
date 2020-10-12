import { Object3D, Group } from "three";
import { calculateAngle } from "./calculateAngle";

export const positionSegment = (
  segment: Object3D,
  x: number,
  y: number,
  xDiff: number,
  yDiff: number
): Group => {
  const group = new Group();
  group.position.set(x, y, 0);
  const angle = calculateAngle(xDiff, yDiff);
  group.rotation.set(0, 0, angle);
  group.add(segment);
  return group;
};
