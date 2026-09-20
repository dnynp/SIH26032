import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sprout, Users, Navigation2, Check, Circle } from 'lucide-react'
import Layout from '../../components/Layout'
import StatusBadge from '../../components/StatusBadge'
import Empty from '../../components/Empty'
import AiQueuePrediction from '../../components/AiQueuePrediction'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { getRequests, getQueue } from '../../services/procurementService'

// Statuses that count as "still in progress" for picking the request to
// feature on the dashboard.
const ACTIVE_STATUSES = ['Pending', 'Approved', 'Scheduled']

const STEPS = ['Pending', 'Approved', 'Scheduled', 'Procured']

function ProgressTrack({ status }) {
  const currentIndex = status === 'Rejected' ? -1 : STEPS.indexOf(status)
  return (
    <div className="row" style={{ gap: 4, flexWrap: 'wrap' }}>
      {STEPS.map((step, i) => {
        const done = i < currentIndex
        const current = i === currentIndex
        return (
          <div key={step} className="row text-sm" style={{ gap: 4 }}>
            {done ? (
              <Check size={15} color="var(--leaf)" />
            ) : (
              <Circle size={15} color={current ? 'var(--marigold)' : 'var(--border-strong)'} fill={current ? 'var(--marigold)' : 'none'} />
            )}
            <span className={current ? '' : 'muted'}>{step}</span>
            {i < STEPS.length - 1 && <span className="muted">—</span>}
          </div>
        )
      })}
    </div>
  )
}

export default function FarmerDashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [requests, setRequests] = useState([])
  const [queue, setQueue] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getRequests()
      .then(async (res) => {
        if (!mounted) return
        const list = res.data || []
        setRequests(list)
        const active = list.find((r) => ACTIVE_STATUSES.includes(r.status))
        if (active) {
          try {
            const q = await getQueue(active._id)
            if (mounted) setQueue(q.data)
          } catch {
            /* queue info optional on the dashboard */
          }
        }
      })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  const active = requests.find((r) => ACTIVE_STATUSES.includes(r.status))
  const farmerName = user?.farmer?.name || user?.name || 'Farmer'

  return (
    <Layout title="Dashboard">
      <h2 style={{ color: 'var(--navy)' }}>{t('farmer.dashboardWelcome')}, {farmerName}</h2>
      <p className="muted mt-8">{t('farmer.dashboardSubtitle')}</p>

      {loading && <p className="mt-24 muted">{t('common.loading')}</p>}

      {!loading && !active && (
        <div className="panel mt-24">
          <Empty
            title={t('farmer.noActiveTitle')}
            description={t('farmer.noActiveBody')}
            action={<Link to="/farmer/create-request" className="btn btn-accent">{t('farmer.createRequest')}</Link>}
          />
        </div>
      )}

      {!loading && active && (
        <div className="grid mt-24" style={{ gridTemplateColumns: '2fr 1fr' }}>
          <div className="stack">
            <div className="panel panel-accent stack">
              <div className="row between">
                <div className="row">
                  <Sprout size={18} color="var(--leaf)" />
                  <strong>{active.cropName} • {active.quantity} {active.unit || 'kg'}</strong>
                </div>
                <StatusBadge status={active.status} />
              </div>

              <div className="text-sm muted row">
                <Navigation2 size={14} />
                {t('common.centre')}: <strong style={{ color: 'var(--ink)' }}>{active.procurementCenter}</strong>
              </div>

              <ProgressTrack status={active.status} />
            </div>

            {queue && <AiQueuePrediction queue={queue} />}

            <Link to={`/farmer/queue/${active._id}`} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
              {t('farmer.trackQueue')}
            </Link>
          </div>

          <div className="stack">
            <div className="panel">
              <div className="panel-title">{t('farmer.totalRequests')}</div>
              <div className="big-number">{requests.length}</div>
            </div>
            <div className="panel">
              <div className="row between">
                <div className="panel-title">Need help?</div>
                <Users size={16} color="var(--muted)" />
              </div>
              <p className="text-sm mt-8">Visit your requests page for full history, or check notifications for updates.</p>
              <Link to="/farmer/requests" className="btn btn-outline btn-sm mt-16">{t('common.viewAll')}</Link>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
