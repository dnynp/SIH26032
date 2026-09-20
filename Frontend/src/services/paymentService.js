import api from './api'

export const getMyPayments = () => api.get('/payments/my-payments')

// Officer/Admin only — a payment can only be created once the request is Procured.
export const createPayment = (procurementId, ratePerUnit) =>
  api.post(`/payments/create/${procurementId}`, { ratePerUnit })

// Officer/Admin only.
export const completePayment = (paymentId) => api.put(`/payments/complete/${paymentId}`)
