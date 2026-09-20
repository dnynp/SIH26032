import api from './api'

export const getDashboard = async () => {
  const response = await api.get('/admin/dashboard')
  const data = response.data
  // The existing backend groups values by resource; screens use a flat model.
  return { ...response, data: {
    totalFarmers: data.totalFarmers ?? data.farmers?.total ?? 0,
    totalRequests: data.totalRequests ?? data.procurementRequests?.total ?? 0,
    pendingRequests: data.pendingRequests ?? data.procurementRequests?.pending ?? 0,
    approvedRequests: data.approvedRequests ?? data.procurementRequests?.approved ?? 0,
    scheduledRequests: data.scheduledRequests ?? data.procurementRequests?.scheduled ?? 0,
    procuredRequests: data.procuredRequests ?? data.procurementRequests?.procured ?? 0,
    rejectedRequests: data.rejectedRequests ?? data.procurementRequests?.rejected ?? 0,
    totalPayments: data.totalPayments ?? data.payments?.total ?? 0,
    completedPayments: data.completedPayments ?? data.payments?.completed ?? 0,
    pendingPayments: data.pendingPayments ?? data.payments?.pending ?? 0,
  }}
}

export const getAllFarmers = async () => {
  const response = await api.get('/admin/farmers')
  return { ...response, data: Array.isArray(response.data) ? response.data : response.data.farmers || [] }
}

export const getAllRequests = async () => {
  const response = await api.get('/admin/requests')
  return { ...response, data: Array.isArray(response.data) ? response.data : response.data.requests || [] }
}

export const getAllPayments = async () => {
  const response = await api.get('/admin/payments')
  return { ...response, data: Array.isArray(response.data) ? response.data : response.data.payments || [] }
}
