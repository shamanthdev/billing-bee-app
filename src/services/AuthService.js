import api from "../api/axios";

export const signupUser = async (payload) => {
  const response = await api.post("/auth/signup", payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await api.post("/auth/login", payload);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post(`/auth/forgot-password?email=${email}`);
  return response.data;
};

export const resetPassword = async (payload) => {
  const response = await api.post("/auth/reset-password", payload);
  return response.data;
};