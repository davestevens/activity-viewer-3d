import { getRequest } from "./authedRequest";

interface IZone {
  heartrate: {
    custom_zones: boolean;
    zones: { min: number; max: number }[];
  };
}

const URL = "https://www.strava.com/api/v3/athlete/zones";

export const getZones = async (): Promise<IZone[]> => {
  const zones = await getRequest<IZone[]>(URL);

  return zones;
};
