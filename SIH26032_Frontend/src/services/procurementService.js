import api from "./api";

export const getRequests = () => api.get("/procurement");
export const getRequest = (id) => api.get(`/procurement/${id}`);
export const createRequest = (data) => api.post("/procurement", data);
export const updateRequest = (id, data) => api.put(`/procurement/${id}`, data);
export const getQueue = (id) => api.get(`/procurement/queue/${id}`);
export const getStatus = (id) => api.get(`/procurement/status/${id}`);
export const markProcured = (id) => api.put(`/procurement/procure/${id}`);
