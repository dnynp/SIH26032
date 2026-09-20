import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle2, Loader2, Hourglass, User } from 'lucide-react'
import Layout from '../../components/Layout'
import Empty from '../../components/Empty'
import AiQueuePrediction from '../../components/AiQueuePrediction'
import { useLanguage } from '../../context/LanguageContext'
import { getRequests, getQueue } from '../../services/procurementService'

// Visual strip of nearby tokens around the farmer's own — the completed
// ones behind, the farmer highlighted, and the waiting ones ahead.
function TokenStrip({ tokenNumber, peopleAhead }) {
  const start = Math.max(1, tokenNumber - 4)
  const tokens = []
  for (let t = start; t <= tokenNumber + 2; t++) {
    if (t === tokenNumber) {
      tokens.push({ t, state: 'you' })
    } else if (t < tokenNumber - Math.min(peopleAhead, 3)) {
      tokens.push({ t, state: 'done' })
    } else if (t < tokenNumber) {
      tokens.push({ t, state: 'processing' })
    } else {
      tokens.push({ t, state: 'waiting' })
    }
  }

  return (
    <div className="stack">
      {tokens.map(({ t, state }) => (
        <div
          key={t}
          className="row between panel"
          style={{
            padding: '10px 16px',
            borderColor: state === 'you' ? 'var(--marigold)' : 'var(--border)',
            background: state === 'you' ? 'var(--marigold-100)' : 'var(--panel)',
          }}
        >
          <span className="row">
            {state === 'done' && <CheckCircle2 size={16} color="var(--leaf)" />}
            {state === 'processing' && <Loader2 size={16} color="var(--wheat)" />}
            {state === 'you' && <User size={16} color="var(--marigold)" />}
            {state === 'waiting' && <Hourglass size={16} color="var(--muted)" />}
            Token #{t}
          </span>
          <span className="text-sm muted" style={{ textTransform: 'capitalize' }}>
            {state === 'you' ? 'You' : state === 'done' ? 'Completed' : state === 'processing' ? 'Processing' : 'Waiting'}
          </span>
        </div>
      ))}
    </div>
  )
}

const ACTIVE_STATUSES = ['Pending', 'Approved', 'Scheduled']

export default function FarmerQueue() {
  const { id } = useParams()
  const { t } = useLanguage()
  const [requestId, setRequestId] = useState(id || null)
  const [queue, setQueue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    async function resolveRequestId() {
      if (id) return id
      const res = await getRequests()
      const active = (res.data || []).find((r) => ACTIVE_STATUSES.includes(r.status))
      return active?._id || null
    }
    resolveRequestId()
      .then((rid) => {
        if (!mounted) return
        setRequestId(rid)
        if (!rid) { setLoading(false); return }
        return getQueue(rid).then((res) => mounted && setQueue(res.data))
      })
      .catch(() => mounted && setError('Could not load queue information.'))
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [id])

  return (
    <Layout title={t('farmer.liveQueue')}>
      {loading && <p className="muted">{t('common.loading')}</p>}

      {!loading && !requestId && (
        <div className="panel">
          <Empty title={t('farmer.noActiveTitle')} description={t('farmer.noActiveBody')} />
        </div>
      )}

      {!loading && error && <div className="alert alert-error">{error}</div>}

      {!loading && queue && (
        <div className="grid" style={{ gridTemplateColumns: '1fr 1.4fr' }}>
          <div className="stack">
            <AiQueuePrediction queue={queue} />
            <div className="panel text-sm stack">
              <div className="row between"><span className="muted">Centre</span><strong>{queue.procurementCenter}</strong></div>
              {queue.estimatedDate && <div className="row between"><span className="muted">Estimated date</span><strong>{queue.estimatedDate}</strong></div>}
              <div className="row between"><span className="muted">Status</span><strong>{queue.status}</strong></div>
            </div>
          </div>

          <div>
            <div className="panel-title mt-8" style={{ marginBottom: 8 }}>Queue view</div>
            <TokenStrip tokenNumber={queue.tokenNumber} peopleAhead={queue.peopleAhead} />
          </div>
        </div>
      )}
    </Layout>
  )
}
