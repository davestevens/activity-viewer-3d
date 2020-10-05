import { writable } from "svelte/store";
import { getActivities, IActivity } from "../services/getActivities";

let page = 0;

const createActivities = () => {
  const initialValue = [];
  const { update, subscribe } = writable<IActivity[]>(initialValue);

  return {
    subscribe,
    getNextPage: async () => {
      const activities = await getActivities(++page);
      update((value) => [...value, ...activities]);
    },
  };
};

export const activities = createActivities();
