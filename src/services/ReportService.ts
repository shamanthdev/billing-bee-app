
import api from "../api/axios";

export const getSalesReport = (params: {
  fromDate: string;
  toDate: string;
}) => {
  return api.get("/reports/sales", { params });
};