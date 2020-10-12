// Takes a list of lat, lng and maps them to 2d space
// Based on code from https://stackoverflow.com/a/53827343
const EARTH_RADIUS_KM = 6371;

// NOTE: this is actually 20
// Based on 100m GPS difference rendering at 5 points difference
const LAT_LNG_TO_ALTITUDE_RATIO = 1;

interface IPosition {
  x: number;
  y: number;
  z: number;
}

interface ILimits {
  min: number;
  max: number;
  diff: number;
}

export const findLimits = (input: number[]): ILimits => {
  const max = Math.max(...input);
  const min = Math.min(...input);
  const diff = max - min;
  return { max, min, diff };
};

export interface IConvertLatLngToPosition {
  positions: IPosition[];
  xLimits: ILimits;
  yLimits: ILimits;
  zLimits: ILimits;
}

export const convertLatLngToPosition = (
  latlngs: number[][],
  altitudes: number[]
): IConvertLatLngToPosition => {
  const latLimits = findLimits(latlngs.map((latlng) => latlng[0]));
  const averageLat = Math.cos((latLimits.max + latLimits.min) / 2);

  const positions = latlngs.map(([lat, lng], index) => ({
    x: EARTH_RADIUS_KM * lng * averageLat,
    y: EARTH_RADIUS_KM * lat,
    z: altitudes[index],
  }));

  const xLimits = findLimits(positions.map((position) => position.x));
  const yLimits = findLimits(positions.map((position) => position.y));
  const zLimits = findLimits(positions.map((position) => position.z));

  return {
    xLimits,
    yLimits,
    zLimits,
    positions: positions.map(({ x, y, z }) => ({
      x: -(x - xLimits.min) + xLimits.diff,
      y: y - yLimits.min,
      z: (z - zLimits.min) / LAT_LNG_TO_ALTITUDE_RATIO,
    })),
  };
};
