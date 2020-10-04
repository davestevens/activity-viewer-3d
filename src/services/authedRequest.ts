import { auth, IAuthStore } from "../stores/auth";
import { get } from "svelte/store";

const getAuthToken = (): string => {
  const value: IAuthStore = get(auth);
  if (!value) {
    throw new Error("Unauthenticated");
  }
  return `Bearer ${value.access_token}`;
};

export const getRequest = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: getAuthToken(),
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    switch (response.status) {
      case 401:
        throw new Error("Auth error");
      default:
        throw new Error("Network Error");
    }
  }

  return response.json();
};
