import api from './api'

// Registration always creates a Farmer account (per backend design).
export const register = (data) => api.post('/auth/register', data)

// Returns { token, user } from the backend.
export const login = (data) => api.post('/auth/login', data)
