import { useLanguage } from '../context/LanguageContext'

// One place that maps a status string to its badge style, so every page
// (farmer, officer, admin) shows the same colour for the same status.
// The status VALUE sent to/from the backend always stays in English
// ("Pending", "Approved", ...) — only the label shown to the person
// is translated.
const STATUS_CLASS = {
  Pending: 'badge-pending',
  Approved: 'badge-approved',
  Scheduled: 'badge-scheduled',
  Procured: 'badge-procured',
  Rejected: 'badge-rejected',
  Completed: 'badge-completed',
  Failed: 'badge-failed',
}

export default function StatusBadge({ status }) {
  const { t } = useLanguage()
  const cls = STATUS_CLASS[status] || 'badge-pending'
  return (
    <span className={`badge ${cls}`}>
      <span className="badge-dot" />
      {t(`statuses.${status}`)}
    </span>
  )
}
