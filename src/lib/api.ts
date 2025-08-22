import axios, { AxiosInstance } from "axios";
import { Session } from "next-auth";

const baseConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v1",
  headers: {
    "Content-Type": "application/json",
  },
};

export const createApiClient = (session?: Session): AxiosInstance => {
  const instance = axios.create(baseConfig);

  if (session?.accessToken) {
    instance.defaults.headers.common["Authorization"] =
      `Bearer ${session.accessToken}`;
  }

  return instance;
};

export const publicApi = axios.create(baseConfig);
