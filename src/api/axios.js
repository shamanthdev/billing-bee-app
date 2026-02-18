import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const setupAxiosInterceptors = (showLoader, hideLoader) => {
  api.interceptors.request.use(
    (config) => {
      showLoader();
      return config;
    },
    (error) => {
      hideLoader();
      return Promise.reject(error);
    },
  );

  api.interceptors.response.use(
    (response) => {
      hideLoader();
      return response;
    },
    (error) => {
      hideLoader();
      return Promise.reject(error);
    },
  );
};

export default api;
