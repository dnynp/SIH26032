import api from "./api";

export const getNotifications = (farmerId) => api.get(`/notifications/${farmerId}`);
export const markRead = (id) => api.put(`/notifications/read/${id}`);
