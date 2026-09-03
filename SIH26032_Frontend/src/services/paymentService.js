import api from "./api";

export const getMyPayments = () => api.get("/payments/my-payments");
export const createPayment = (id, data) => api.post(`/payments/create/${id}`, data);
export const completePayment = (id) => api.put(`/payments/complete/${id}`);
