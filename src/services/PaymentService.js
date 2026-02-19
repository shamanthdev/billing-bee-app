import api from "../api/axios";

const BASE_URL = "/payments";

export const createPayment = (payload) => {
  return api.post(BASE_URL, payload);
};

export const getPaymentByBillId = (billId) => {
  return api.get(`${BASE_URL}/bill/${billId}`);
};
