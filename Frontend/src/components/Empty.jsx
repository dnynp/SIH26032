export default function Empty({ title, description, action }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      {description && <p className="mt-8">{description}</p>}
      {action && <div className="mt-16">{action}</div>}
    </div>
  )
}
