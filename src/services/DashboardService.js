
import api from "../api/axios";

export const getSalesDashboard = () =>
  api.get("/dashboard/sales");