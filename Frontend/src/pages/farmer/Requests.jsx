import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import StatusBadge from '../../components/StatusBadge'
import Empty from '../../components/Empty'
import { useLanguage } from '../../context/LanguageContext'
import { getRequests } from '../../services/procurementService'

export default function FarmerRequests() {
  const { t } = useLanguage()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRequests().then((res) => setRequests(res.data || [])).finally(() => setLoading(false))
  }, [])

  return (
    <Layout title={t('nav.myRequests')}>
      {loading && <p className="muted">{t('common.loading')}</p>}

      {!loading && requests.length === 0 && (
        <div className="panel">
          <Empty
            title={t('farmer.noRequestsTitle')}
            description={t('farmer.noRequestsBody')}
            action={<Link to="/farmer/create-request" className="btn btn-accent">{t('farmer.createRequest')}</Link>}
          />
        </div>
      )}

      {!loading && requests.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t('common.token')}</th>
                <th>{t('common.crop')}</th>
                <th>{t('common.quantity')}</th>
                <th>{t('common.centre')}</th>
                <th>Scheduled date</th>
                <th>{t('common.status')}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id}>
                  <td>#{r.tokenNumber ?? '—'}</td>
                  <td>{r.cropName}</td>
                  <td>{r.quantity} {r.unit || 'kg'}</td>
                  <td>{r.procurementCenter}</td>
                  <td>{r.scheduledDate ? new Date(r.scheduledDate).toLocaleDateString() : '—'}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>
                    <div className="row">
                      <Link className="btn btn-outline btn-sm" to={`/farmer/status/${r._id}`}>{t('common.status')}</Link>
                      <Link className="btn btn-outline btn-sm" to={`/farmer/queue/${r._id}`}>{t('nav.queue')}</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
