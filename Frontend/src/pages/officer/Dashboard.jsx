import { useEffect, useState } from 'react'
import { Users, Hourglass, Loader2, CheckCircle2 } from 'lucide-react'
import Layout from '../../components/Layout'
import StatCard from '../../components/StatCard'
import { getRequests } from '../../services/procurementService'

function isToday(dateStr) {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const now = new Date()
  return d.toDateString() === now.toDateString()
}

export default function OfficerDashboard() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRequests().then((res) => setRequests(res.data || [])).finally(() => setLoading(false))
  }, [])

  // Derived from the existing procurement list — there is no separate
  // "today's farmers" API yet, so these counts are computed on the frontend.
  const todaysRequests = requests.filter((r) => isToday(r.scheduledDate) || ['Pending', 'Approved', 'Scheduled'].includes(r.status))
  const waiting = requests.filter((r) => ['Pending', 'Approved', 'Scheduled'].includes(r.status)).length
  const processing = requests.filter((r) => r.status === 'Scheduled').length
  const completed = requests.filter((r) => r.status === 'Procured').length

  return (
    <Layout title="Officer dashboard">
      {loading && <p className="muted">Loading…</p>}
      {!loading && (
        <>
          <div className="grid">
            <StatCard label="Today's farmers" value={todaysRequests.length} icon={Users} accent="var(--navy)" />
            <StatCard label="Waiting" value={waiting} icon={Hourglass} accent="var(--wheat)" />
            <StatCard label="Processing" value={processing} icon={Loader2} accent="var(--marigold)" />
            <StatCard label="Completed" value={completed} icon={CheckCircle2} accent="var(--leaf)" />
          </div>
          <p className="text-sm muted mt-16">
            These figures are computed from current procurement requests. Dedicated
            arrival/processing tracking will use the operational APIs described in
            the officer workflow once they are available on the backend.
          </p>
        </>
      )}
    </Layout>
  )
}
