import { useEffect, useMemo, useState } from 'react'
import Layout from '../../components/Layout'
import StatusBadge from '../../components/StatusBadge'
import Empty from '../../components/Empty'
import { getAllRequests } from '../../services/adminService'

const STATUSES = ['All', 'Pending', 'Approved', 'Scheduled', 'Procured', 'Rejected']

export default function AdminRequests() {
  const [requests, setRequests] = useState([])
  const [status, setStatus] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllRequests().then((res) => setRequests(res.data || [])).finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return requests.filter((r) => {
      const matchesStatus = status === 'All' || r.status === status
      const matchesSearch = !q ||
        r.cropName?.toLowerCase().includes(q) ||
        r.procurementCenter?.toLowerCase().includes(q) ||
        r.farmer?.name?.toLowerCase().includes(q)
      return matchesStatus && matchesSearch
    })
  }, [requests, status, search])

  return (
    <Layout title="All requests">
      <div className="row" style={{ flexWrap: 'wrap', marginBottom: 16 }}>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: 180 }}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          placeholder="Search farmer, crop or centre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 260 }}
        />
      </div>

      {loading && <p className="muted">Loading…</p>}

      {!loading && filtered.length === 0 && (
        <div className="panel"><Empty title="No matching requests" /></div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Token</th><th>Farmer</th><th>Crop</th><th>Quantity</th><th>Centre</th><th>Scheduled</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r._id}>
                  <td>#{r.tokenNumber ?? '—'}</td>
                  <td>{r.farmer?.name || '—'}</td>
                  <td>{r.cropName}</td>
                  <td>{r.quantity} {r.unit || 'kg'}</td>
                  <td>{r.procurementCenter}</td>
                  <td>{r.scheduledDate ? new Date(r.scheduledDate).toLocaleDateString() : '—'}</td>
                  <td><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
