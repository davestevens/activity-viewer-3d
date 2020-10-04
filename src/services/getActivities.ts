import { getRequest } from "./authedRequest";

export interface IActivity {
  name: string;
  type: string;
  id: string;
  has_heartrate: boolean;
  start_date: string;
  start_latlng: number[];
}

const URL = "https://www.strava.com/api/v3/athlete/activities";

export const getActivities = async (): Promise<IActivity[]> => {
  const activities = await getRequest<IActivity[]>(URL);

  return activities;
};
