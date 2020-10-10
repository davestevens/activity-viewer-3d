import { writable } from "svelte/store";
import { SELECTED_ACTIVITY_KEY } from "../consts";
import type { IActivity } from "../services/getActivities";

const createActivity = () => {
  const initialValue =
    JSON.parse(localStorage.getItem(SELECTED_ACTIVITY_KEY)) || null;
  const { set, subscribe } = writable<IActivity | null>(initialValue);

  subscribe((val) => {
    localStorage.setItem(SELECTED_ACTIVITY_KEY, JSON.stringify(val));
  });

  return {
    subscribe,
    clearActivity: () => set(null),
    selectActivity: (activity: IActivity) => set(activity),
  };
};

export const activity = createActivity();
