
import api from "../api/axios";

export const getSalesDashboard = () =>
  api.get("/dashboard/sales");

export const getLowStockProducts = () => {
  return api.get("/dashboard/low-stock");
};