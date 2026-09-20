import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import Empty from '../../components/Empty'
import { useLanguage } from '../../context/LanguageContext'
import { getMyPayments } from '../../services/paymentService'

export default function FarmerPayments() {
  const { t } = useLanguage()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyPayments().then((res) => setPayments(res.data || [])).finally(() => setLoading(false))
  }, [])

  return (
    <Layout title={t('nav.payments')}>
      {loading && <p className="muted">{t('common.loading')}</p>}

      {!loading && payments.length === 0 && (
        <div className="panel"><Empty title={t('farmer.noPayments')} description="Payments appear here once your crop has been procured." /></div>
      )}

      <div className="grid mt-16">
        {payments.map((p) => (
          <div key={p._id} className="panel panel-accent" style={{ borderLeftColor: p.paymentStatus === 'Completed' ? 'var(--leaf)' : p.paymentStatus === 'Failed' ? 'var(--danger)' : 'var(--wheat)' }}>
            <div className="row between">
              <strong>{p.procurementRequest?.cropName || 'Crop'}</strong>
              <span className={`badge badge-${p.paymentStatus?.toLowerCase()}`}>{t(`statuses.${p.paymentStatus}`)}</span>
            </div>
            <p className="text-sm muted mt-8">{p.quantity} {p.procurementRequest?.unit || 'kg'} • ₹{p.ratePerUnit}/unit</p>
            <div className="big-number mt-8">₹{p.totalAmount}</div>
            {p.paymentDate && <p className="text-sm muted mt-8">Paid on {new Date(p.paymentDate).toLocaleDateString()}</p>}
          </div>
        ))}
      </div>
    </Layout>
  )
}
