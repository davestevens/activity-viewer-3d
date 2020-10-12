import { findLimits } from "./findLimits";

const EARTH_RADIUS_KM = 6371;
const BASE_ALTITUDE = 5;

export interface IPositionData {
  positions: IPosition[];
  size: number;
}

export interface IPosition {
  x: number;
  y: number;
  z: number;
}

const getPositionsFromGPS = (
  latlngs: number[][],
  altitudes: number[]
): IPosition[] => {
  const latLimits = findLimits(latlngs.map((latlng) => latlng[0]));
  const averageLat = Math.cos((latLimits.max + latLimits.min) / 2);

  return latlngs.map(([lat, lng], index) => ({
    x: EARTH_RADIUS_KM * lng * averageLat,
    y: EARTH_RADIUS_KM * lat,
    z: altitudes[index],
  }));
};

const ROTATION = 2 * Math.PI;
const SPACING = 3;
const SEGMENT_LENGTH = 3;
const CENTER_OFFSET = 8;

// Generates a spiral
const generatePositions = (count: number): IPosition[] => {
  const positions: IPosition[] = [];
  let theta: number = CENTER_OFFSET;
  for (let i = 0; i < count; ++i) {
    const radius = SPACING * theta;
    const angle = theta + ROTATION;
    theta += SEGMENT_LENGTH / radius;

    positions.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z: 1 + BASE_ALTITUDE,
    });
  }
  return positions;
};

export const getPositions = (
  count: number,
  latlngs?: number[][],
  altitudes?: number[]
): IPositionData => {
  const hasGPSData = latlngs && altitudes;
  const positions = hasGPSData
    ? getPositionsFromGPS(latlngs, altitudes)
    : generatePositions(count);

  const xLimits = findLimits(positions.map((position) => position.x));
  const yLimits = findLimits(positions.map((position) => position.y));
  const zLimits = findLimits(positions.map((position) => position.z));

  return {
    positions: positions.map(({ x, y, z }) => ({
      x: -(x - xLimits.min) + xLimits.diff / 2,
      y: y - yLimits.min - yLimits.diff / 2,
      z: z - zLimits.min + BASE_ALTITUDE,
    })),
    size: Math.max(xLimits.diff, yLimits.diff),
  };
};
