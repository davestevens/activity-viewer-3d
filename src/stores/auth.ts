import { writable } from "svelte/store";
import { AUTH_KEY } from "../consts";

export interface IAuthStore {
  access_token: string;
  athlete: {
    firstname: string;
    lastname: string;
    profile_medium: string;
  };
}

const createAuth = () => {
  const initialValue = JSON.parse(localStorage.getItem(AUTH_KEY)) || null;
  const { set, subscribe } = writable<IAuthStore | null>(initialValue);

  subscribe((val) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(val));
  });

  return {
    subscribe,
    clearAuth: () => set(null),
    setAuth: (auth: IAuthStore) => set(auth),
  };
};

export const auth = createAuth();
