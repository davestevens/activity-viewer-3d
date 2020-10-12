export const calculateAngle = (x: number, y: number): number => {
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
