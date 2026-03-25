
import api from "../api/axios";

export const getSalesDashboard = () =>
  api.get("/dashboard/sales");

export const getLowStockProducts = () => {
  return api.get("/dashboard/low-stock");
};
export const getDashboard = async () => {
  const res = await api.get("/dashboard/dashboard");
  return res.data;
};