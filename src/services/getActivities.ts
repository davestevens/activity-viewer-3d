import { getRequest } from "./authedRequest";

export interface IActivity {
  name: string;
  type: string;
  id: string;
  has_heartrate: boolean;
  start_date: string;
  start_latlng: number[];
}

const URL = "https://www.strava.com/api/v3/athlete/activities?page={page}";

export const getActivities = async (page: number): Promise<IActivity[]> => {
  const url = URL.replace("{page}", `${page}`);
  const activities = await getRequest<IActivity[]>(url);

  return activities;
};
