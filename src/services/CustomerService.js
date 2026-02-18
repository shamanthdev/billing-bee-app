import api from "../api/axios";


export const getCustomers = () =>
  api.get("/customers");

export const getCustomerById = (id) =>
  api.get(`/customers/${id}`);

export const createCustomer = (payload) =>
  api.post("/customers", payload);

export const updateCustomer = (id, payload) =>
  api.put(`/customers/${id}`, payload);

export const deleteCustomer = (id) =>
  api.delete(`/customers/${id}`);
