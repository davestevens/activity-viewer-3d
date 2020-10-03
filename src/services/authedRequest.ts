import { AUTH_KEY } from "../consts";

const getAuthToken = (): string => {
  const authData = JSON.parse(localStorage.getItem(AUTH_KEY));
  const accessToken = authData?.access_token;
  return `Bearer ${accessToken}`;
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
