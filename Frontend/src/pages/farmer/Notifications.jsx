import { useEffect, useState } from 'react'
import { Bell, BellRing } from 'lucide-react'
import Layout from '../../components/Layout'
import Empty from '../../components/Empty'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { getNotifications, markAsRead } from '../../services/notificationService'

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hr ago`
  return `${Math.floor(hours / 24)} day(s) ago`
}

export default function FarmerNotifications() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const farmerId = user?.farmer?._id || user?.userId

  useEffect(() => {
    if (!farmerId) { setLoading(false); return }
    getNotifications(farmerId).then((res) => setItems(res.data || [])).finally(() => setLoading(false))
  }, [farmerId])

  const handleRead = async (notif) => {
    if (notif.isRead) return
    await markAsRead(notif._id)
    setItems((prev) => prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n)))
  }

  const unreadCount = items.filter((n) => !n.isRead).length

  return (
    <Layout title={t('nav.notifications')}>
      <div className="row between mt-8">
        <p className="muted">{unreadCount} {t('farmer.unread')}</p>
      </div>

      {loading && <p className="muted mt-16">{t('common.loading')}</p>}

      {!loading && items.length === 0 && (
        <div className="panel mt-16"><Empty title={t('farmer.noNotifications')} description="Updates on your procurement requests will appear here." /></div>
      )}

      <div className="stack mt-16">
        {items.map((n) => (
          <div
            key={n._id}
            className="panel"
            style={{
              cursor: n.isRead ? 'default' : 'pointer',
              borderLeft: n.isRead ? '1px solid var(--border)' : '4px solid var(--marigold)',
              background: n.isRead ? 'var(--panel)' : 'var(--marigold-100)',
            }}
            onClick={() => handleRead(n)}
          >
            <div className="row between">
              <div className="row">
                {n.isRead ? <Bell size={16} color="var(--muted)" /> : <BellRing size={16} color="var(--marigold)" />}
                <strong>{n.title}</strong>
              </div>
              <span className="text-sm muted">{timeAgo(n.createdAt)}</span>
            </div>
            <p className="text-sm mt-8">{n.message}</p>
          </div>
        ))}
      </div>
    </Layout>
  )
}
