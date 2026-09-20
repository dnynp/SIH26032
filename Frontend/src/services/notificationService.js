import api from './api'

// Officer/Admin only.
export const createNotification = (data) => api.post('/notifications', data)

export const getNotifications = (farmerId) => api.get(`/notifications/${farmerId}`)

export const markAsRead = (id) => api.put(`/notifications/read/${id}`)
