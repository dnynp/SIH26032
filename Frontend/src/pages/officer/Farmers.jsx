import { useEffect, useMemo, useState } from 'react'
import Layout from '../../components/Layout'
import Empty from '../../components/Empty'
import { getRequests } from '../../services/procurementService'

// There is no dedicated "officer: list farmers" API yet, so this page
// builds a farmer directory from the farmer details already attached to
// each procurement request.
export default function OfficerFarmers() {
  const [requests, setRequests] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRequests().then((res) => setRequests(res.data || [])).finally(() => setLoading(false))
  }, [])

  const farmers = useMemo(() => {
    const byId = new Map()
    requests.forEach((r) => {
      const f = r.farmer
      if (f && f._id && !byId.has(f._id)) byId.set(f._id, f)
    })
    return Array.from(byId.values()).filter((f) =>
      !search || f.name?.toLowerCase().includes(search.toLowerCase()) || f.mobile?.includes(search)
    )
  }, [requests, search])

  return (
    <Layout title="Farmers">
      <input
        placeholder="Search by name or mobile number"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 320, marginBottom: 16 }}
      />

      {loading && <p className="muted">Loading…</p>}

      {!loading && farmers.length === 0 && (
        <div className="panel"><Empty title="No farmers found" /></div>
      )}

      {!loading && farmers.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Mobile</th><th>Village</th><th>District</th><th>State</th></tr>
            </thead>
            <tbody>
              {farmers.map((f) => (
                <tr key={f._id}>
                  <td>{f.name}</td>
                  <td>{f.mobile}</td>
                  <td>{f.village}</td>
                  <td>{f.district}</td>
                  <td>{f.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
