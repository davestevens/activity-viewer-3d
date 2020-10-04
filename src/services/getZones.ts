import { getRequest } from "./authedRequest";

export interface IZoneData {
  custom_zones: boolean;
  zones: { min: number; max: number }[];
}

interface IZone {
  heart_rate: IZoneData;
}

const URL = "https://www.strava.com/api/v3/athlete/zones";

export const getZones = async (): Promise<IZone> => {
  const zones = await getRequest<IZone>(URL);

  return zones;
};
