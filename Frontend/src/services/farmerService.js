import api from './api'

export const getMyProfile = () => api.get('/farmers/me')
export const updateMyProfile = (data) => api.put('/farmers/me', data)
