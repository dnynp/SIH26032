import { useEffect, useMemo, useState } from 'react'
import Layout from '../../components/Layout'
import Empty from '../../components/Empty'
import { getAllFarmers } from '../../services/adminService'

export default function AdminFarmers() {
  const [farmers, setFarmers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllFarmers().then((res) => setFarmers(res.data || [])).finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return farmers.filter((f) =>
      !q || f.name?.toLowerCase().includes(q) || f.mobile?.includes(q) || f.district?.toLowerCase().includes(q)
    )
  }, [farmers, search])

  return (
    <Layout title="Farmers">
      <input
        placeholder="Search by name, mobile or district"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 320, marginBottom: 16 }}
      />

      {loading && <p className="muted">Loading…</p>}

      {!loading && filtered.length === 0 && (
        <div className="panel"><Empty title="No farmers found" /></div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Mobile</th><th>Village</th><th>District</th><th>State</th></tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
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
