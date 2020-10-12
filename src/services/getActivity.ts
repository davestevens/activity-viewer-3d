import { getRequest } from "./authedRequest";
import { ACTIVITY_KEY } from "../consts";

export interface IActivity {
  distance: {
    data: number[];
  };
  latlng?: {
    data: number[][];
  };
  velocity_smooth?: {
    data: number[];
  };
  altitude?: {
    data: number[];
  };
  heartrate?: {
    data: number[];
  };
}

const URL =
  "https://www.strava.com/api/v3/activities/{id}/streams?keys=latlng,velocity_smooth,altitude,heartrate&key_by_type=true";

export const getActivity = async (id: string): Promise<IActivity> => {
  const activityKey = ACTIVITY_KEY.replace("{id}", id);
  const storedActivityData = JSON.parse(localStorage.getItem(activityKey));

  if (storedActivityData) {
    return storedActivityData;
  }
  const url = URL.replace("{id}", id);
  const activity = await getRequest<IActivity>(url);

  localStorage.setItem(activityKey, JSON.stringify(activity));

  return activity;
};
