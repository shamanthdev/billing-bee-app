import axios from "axios";
import { BASE_URL } from "../Config";

const api = axios.create({
  baseURL: BASE_URL,
});

export const setupAxiosInterceptors = (showLoader, hideLoader) => {

  api.interceptors.request.use(
    (config) => {

      showLoader();

      // Attach token automatically
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      hideLoader();
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      hideLoader();
      return response;
    },
    (error) => {
      hideLoader();

      // Auto logout if token expired
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }

      return Promise.reject(error);
    }
  );
};

export default api;