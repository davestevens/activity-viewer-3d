import { getRequest } from "./authedRequest";

export interface IActivity {
  latlng: {
    data: number[][];
  };
  velocity_smooth: {
    data: number[];
  };
  altitude: {
    data: number[];
  };
  heartrate: {
    data: number[];
  };
}

const URL =
  "https://www.strava.com/api/v3/activities/{id}/streams?keys=latlng,velocity_smooth,altitude,heartrate&key_by_type=true";

export const getActivity = async (id: string): Promise<IActivity> => {
  const storedActivityKey = `ACTIVITY_${id}`;
  const storedActivityData = JSON.parse(
    localStorage.getItem(storedActivityKey)
  );

  if (storedActivityData) {
    return storedActivityData;
  }
  const url = URL.replace("{id}", id);
  const activity = await getRequest<IActivity>(url);

  localStorage.setItem(storedActivityKey, JSON.stringify(activity));

  return activity;
};
