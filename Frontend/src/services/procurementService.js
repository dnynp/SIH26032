import api from './api'

export const getRequests = () => api.get('/procurement')

export const getRequestById = (id) => api.get(`/procurement/${id}`)

// farmer, cropName, quantity, procurementCenter — unit defaults to kg on the backend.
export const createRequest = (data) => api.post('/procurement', data)

// Officer/Admin only — updates status (Pending/Approved/Scheduled/Procured/Rejected).
export const updateRequestStatus = (id, status) => api.put(`/procurement/${id}`, { status })

// Officer/Admin only — moves a Scheduled request to Procured.
export const markProcured = (id) => api.put(`/procurement/procure/${id}`)

export const getQueue = (id) => api.get(`/procurement/queue/${id}`)

export const getStatus = (id) => api.get(`/procurement/status/${id}`)
export const markArrived = (id) => api.put(`/procurement/${id}/arrive`)
export const saveQualityCheck = (id, data) => api.put(`/procurement/${id}/quality`, data)
export const saveWeight = (id, actualWeight) => api.put(`/procurement/${id}/weigh`, { actualWeight })
export const startProcessing = (id) => api.put(`/procurement/${id}/start`)
