import toast from "react-hot-toast";
import api from "../api/axios";

export const getActiveProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (payload) => {
  const response = await api.post("/products", payload);
  try {
    toast.success("Product disabled successfully");
  } catch (e) {
    toast.error("Failed to disable product");
  }
  return response.data;
};

export const updateProduct = async (id, payload) => {
  const response = await api.put(`/products/${id}`, payload);
  return response.data;
};

export const disableProduct = async (id) => {
  const response = await api.put(`/products/${id}/disable`);

  return response.data;
};

export const createBill = async (payload) => {
  const response = await api.post("/bills", payload);
  return response.data; // billId
};

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
