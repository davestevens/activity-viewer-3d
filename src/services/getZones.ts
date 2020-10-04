import { getRequest } from "./authedRequest";
import { ZONES_KEY } from "../consts";

export interface IZoneData {
  custom_zones: boolean;
  zones: { min: number; max: number }[];
}

interface IZone {
  heart_rate: IZoneData;
}

const URL = "https://www.strava.com/api/v3/athlete/zones";

export const getZones = async (): Promise<IZone> => {
  const storedZonesData = JSON.parse(localStorage.getItem(ZONES_KEY));

  if (storedZonesData) {
    return storedZonesData;
  }

  const zones = await getRequest<IZone>(URL);

  localStorage.setItem(ZONES_KEY, JSON.stringify(zones));

  return zones;
};
