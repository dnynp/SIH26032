import { useEffect, useState } from 'react'
import { Users, ListChecks, Hourglass, CheckCircle2, XCircle, Wallet, IndianRupee } from 'lucide-react'
import Layout from '../../components/Layout'
import StatCard from '../../components/StatCard'
import { getDashboard } from '../../services/adminService'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard().then((res) => setStats(res.data)).finally(() => setLoading(false))
  }, [])

  return (
    <Layout title="Admin dashboard">
      {loading && <p className="muted">Loading…</p>}
      {!loading && stats && (
        <>
          <div className="panel-title mt-8" style={{ marginBottom: 8 }}>Farmers &amp; requests</div>
          <div className="grid">
            <StatCard label="Total farmers" value={stats.totalFarmers ?? 0} icon={Users} accent="var(--navy)" />
            <StatCard label="Total requests" value={stats.totalRequests ?? 0} icon={ListChecks} accent="var(--navy)" />
            <StatCard label="Pending" value={stats.pendingRequests ?? 0} icon={Hourglass} accent="var(--wheat)" />
            <StatCard label="Approved" value={stats.approvedRequests ?? 0} icon={CheckCircle2} accent="var(--navy)" />
            <StatCard label="Scheduled" value={stats.scheduledRequests ?? 0} icon={Hourglass} accent="var(--marigold)" />
            <StatCard label="Procured" value={stats.procuredRequests ?? 0} icon={CheckCircle2} accent="var(--leaf)" />
            <StatCard label="Rejected" value={stats.rejectedRequests ?? 0} icon={XCircle} accent="var(--danger)" />
          </div>

          <div className="panel-title mt-24" style={{ marginBottom: 8 }}>Payments</div>
          <div className="grid">
            <StatCard label="Total payments" value={stats.totalPayments ?? 0} icon={Wallet} accent="var(--navy)" />
            <StatCard label="Completed" value={stats.completedPayments ?? 0} icon={IndianRupee} accent="var(--leaf)" />
            <StatCard label="Pending" value={stats.pendingPayments ?? 0} icon={Hourglass} accent="var(--wheat)" />
          </div>
        </>
      )}
    </Layout>
  )
}
