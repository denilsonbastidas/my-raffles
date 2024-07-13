import axios from "axios";
import { API_ENDPOINT } from "./constants";

const globalAxiosApi = axios.create({
  baseURL: API_ENDPOINT,
});

globalAxiosApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default globalAxiosApi;
