import { getRequest } from "./authedRequest";

export interface IActivity {
  name: string;
  type: string;
  id: string;
  start_date: Date;
}

const URL = "https://www.strava.com/api/v3/athlete/activities";

export const getActivities = async (): Promise<IActivity[]> => {
  const activities = await getRequest<IActivity[]>(URL);

  return activities.map((activity) => ({
    name: activity.name,
    type: activity.type,
    id: activity.id,
    start_date: new Date(activity.start_date),
  }));
};
