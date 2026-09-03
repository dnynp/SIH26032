import api from "./api";

export const getAdminDashboard = () => api.get("/admin/dashboard");
export const getAdminFarmers = () => api.get("/admin/farmers");
export const getAdminRequests = () => api.get("/admin/requests");
export const getAdminPayments = () => api.get("/admin/payments");
