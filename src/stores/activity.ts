import { writable } from "svelte/store";
import { SELECTED_ACTIVITY_KEY } from "../consts";

const createActivity = () => {
  const initialValue =
    JSON.parse(localStorage.getItem(SELECTED_ACTIVITY_KEY)) || null;
  const { set, subscribe } = writable<string | null>(initialValue);

  subscribe((val) => {
    localStorage.setItem(SELECTED_ACTIVITY_KEY, JSON.stringify(val));
  });

  return {
    subscribe,
    clearActivity: () => set(null),
    selectActivity: (id: string) => set(id),
  };
};

export const activity = createActivity();
