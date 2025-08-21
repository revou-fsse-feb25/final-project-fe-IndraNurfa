import axios, { AxiosInstance } from "axios";
import { Session } from "next-auth";

export const createApiClient = (session?: Session): AxiosInstance => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v1";

  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Attach access token if session is provided
  if (session?.accessToken) {
    instance.defaults.headers.common["Authorization"] =
      `Bearer ${session.accessToken}`;
  }

  return instance;
};

export const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v1",
  headers: { "Content-Type": "application/json" },
});
