import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import Empty from '../../components/Empty'
import { getAllPayments } from '../../services/adminService'

export default function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllPayments().then((res) => setPayments(res.data || [])).finally(() => setLoading(false))
  }, [])

  return (
    <Layout title="All payments">
      {loading && <p className="muted">Loading…</p>}

      {!loading && payments.length === 0 && (
        <div className="panel"><Empty title="No payments yet" /></div>
      )}

      {!loading && payments.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Farmer</th><th>Crop</th><th>Quantity</th><th>Amount</th><th>Status</th><th>Paid on</th></tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td>{p.farmer?.name || '—'}</td>
                  <td>{p.procurementRequest?.cropName || '—'}</td>
                  <td>{p.quantity} {p.procurementRequest?.unit || 'kg'}</td>
                  <td>₹{p.totalAmount}</td>
                  <td><span className={`badge badge-${p.paymentStatus?.toLowerCase()}`}>{p.paymentStatus}</span></td>
                  <td>{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
