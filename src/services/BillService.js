import api from "../api/axios";

export const getBills = async ({ page = 0, size = 10, search = "" }) => {
  const res = await api.get("/bills/list", {
    params: {
      page,
      size,
      search,
    },
  });

  return res.data;
};

export const createBill = async (payload) => {
  const response = await api.post("/bills", payload);
  return response.data; // billId
};
export const getBillDetails = async (id) => {
  const response = await api.get(`/bills/details/${id}`);
  return response.data;
};

export const downloadBillPdf = async (billId) => {
  const response = await api.get(`/bills/${billId}/pdf`, {
    responseType: "blob", // IMPORTANT
  });

  return response.data;
};

export const getBillById = async (id) => {
  const response = await api.get(`/bills/${id}`);
  return response.data;
};

export const cancelBill = (id) => api.put(`/bills/${id}/cancel`);

export const updateBill = (id, payload) =>
  api.put(`/bills/${id}`, payload);