import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import Empty from '../../components/Empty'
import { getRequests, getStatus } from '../../services/procurementService'
import { createPayment, completePayment } from '../../services/paymentService'

export default function OfficerPayments() {
  const [rows, setRows] = useState([]) // { request, payment }
  const [rateInputs, setRateInputs] = useState({})
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    const res = await getRequests()
    const procured = (res.data || []).filter((r) => r.status === 'Procured')
    // A payment can only exist once the request is Procured, so we look
    // up each one's status to see if a payment has already been created.
    const withPayments = await Promise.all(
      procured.map(async (r) => {
        try {
          const s = await getStatus(r._id)
          return { request: r, payment: s.data?.payment || null }
        } catch {
          return { request: r, payment: null }
        }
      })
    )
    setRows(withPayments)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (requestId) => {
    const rate = Number(rateInputs[requestId])
    if (!rate || rate <= 0) {
      setError('Enter a valid rate per unit before creating the payment.')
      return
    }
    setError('')
    setBusyId(requestId)
    try {
      await createPayment(requestId, rate)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create payment.')
    } finally {
      setBusyId(null)
    }
  }

  const handleComplete = async (paymentId) => {
    setBusyId(paymentId)
    try {
      await completePayment(paymentId)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not complete payment.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <Layout title="Payments">
      {error && <div className="alert alert-error">{error}</div>}
      {loading && <p className="muted">Loading…</p>}

      {!loading && rows.length === 0 && (
        <div className="panel"><Empty title="No procured requests awaiting payment" /></div>
      )}

      <div className="stack mt-16">
        {rows.map(({ request, payment }) => (
          <div key={request._id} className="panel row between" style={{ flexWrap: 'wrap', gap: 16 }}>
            <div>
              <strong>{request.farmer?.name || 'Farmer'}</strong>
              <p className="text-sm muted">{request.cropName} • {request.quantity} {request.unit || 'kg'} • {request.procurementCenter}</p>
            </div>

            {!payment && (
              <div className="row">
                <input
                  type="number"
                  min="1"
                  placeholder="Rate per unit (₹)"
                  style={{ width: 160 }}
                  value={rateInputs[request._id] || ''}
                  onChange={(e) => setRateInputs({ ...rateInputs, [request._id]: e.target.value })}
                />
                <button className="btn btn-primary btn-sm" disabled={busyId === request._id} onClick={() => handleCreate(request._id)}>
                  Create payment
                </button>
              </div>
            )}

            {payment && (
              <div className="row">
                <span className={`badge badge-${payment.paymentStatus?.toLowerCase()}`}>{payment.paymentStatus}</span>
                <strong>₹{payment.totalAmount}</strong>
                {payment.paymentStatus === 'Pending' && (
                  <button className="btn btn-accent btn-sm" disabled={busyId === payment._id} onClick={() => handleComplete(payment._id)}>
                    Mark completed
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Layout>
  )
}
