import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Check, Circle } from 'lucide-react'
import Layout from '../../components/Layout'
import Empty from '../../components/Empty'
import { useLanguage } from '../../context/LanguageContext'
import { getRequests, getStatus } from '../../services/procurementService'

const TIMELINE = ['Pending', 'Approved', 'Scheduled', 'Procured', 'Payment']
const ACTIVE_STATUSES = ['Pending', 'Approved', 'Scheduled', 'Procured']

export default function FarmerStatus() {
  const { id } = useParams()
  const { t } = useLanguage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function resolveId() {
      if (id) return id
      const res = await getRequests()
      const list = res.data || []
      const active = list.find((r) => ACTIVE_STATUSES.includes(r.status)) || list[0]
      return active?._id || null
    }
    resolveId()
      .then((rid) => (rid ? getStatus(rid) : null))
      .then((res) => mounted && setData(res?.data || null))
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [id])

  const request = data?.request || data
  const payment = data?.payment

  const statusIndex = request ? TIMELINE.indexOf(request.status) : -1
  const paymentDone = payment?.paymentStatus === 'Completed'

  return (
    <Layout title={t('common.status')}>
      {loading && <p className="muted">{t('common.loading')}</p>}

      {!loading && !request && (
        <div className="panel"><Empty title="No procurement request found" /></div>
      )}

      {!loading && request && (
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="panel">
            <div className="panel-title">{t('farmer.timeline')}</div>
            <div className="stack mt-16">
              {TIMELINE.map((step, i) => {
                const done = step === 'Payment' ? paymentDone : i < statusIndex || (i === statusIndex && request.status !== 'Rejected')
                const label = step === 'Payment' ? t('farmer.payment') : t(`statuses.${step}`)
                return (
                  <div key={step} className="row">
                    {done ? <Check size={16} color="var(--leaf)" /> : <Circle size={16} color="var(--border-strong)" />}
                    <span className={done ? '' : 'muted'}>{label}</span>
                  </div>
                )
              })}
              {request.status === 'Rejected' && (
                <div className="alert alert-error mt-8">This request was rejected.</div>
              )}
            </div>
          </div>

          <div className="stack">
            <div className="panel">
              <div className="panel-title">{t('farmer.requestDetails')}</div>
              <div className="stack mt-8 text-sm">
                <div className="row between"><span className="muted">{t('common.crop')}</span><strong>{request.cropName}</strong></div>
                <div className="row between"><span className="muted">{t('common.quantity')}</span><strong>{request.quantity} {request.unit || 'kg'}</strong></div>
                <div className="row between"><span className="muted">{t('common.token')}</span><strong>#{request.tokenNumber}</strong></div>
                <div className="row between"><span className="muted">{t('common.centre')}</span><strong>{request.procurementCenter}</strong></div>
                {request.scheduledDate && (
                  <div className="row between"><span className="muted">Scheduled date</span><strong>{new Date(request.scheduledDate).toLocaleDateString()}</strong></div>
                )}
              </div>
            </div>

            {payment && (
              <div className="panel">
                <div className="panel-title">{t('farmer.payment')}</div>
                <div className="stack mt-8 text-sm">
                  <div className="row between"><span className="muted">Amount</span><strong>₹{payment.totalAmount}</strong></div>
                  <div className="row between"><span className="muted">{t('common.status')}</span><strong>{t(`statuses.${payment.paymentStatus}`)}</strong></div>
                  {payment.paymentDate && (
                    <div className="row between"><span className="muted">Paid on</span><strong>{new Date(payment.paymentDate).toLocaleDateString()}</strong></div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}
