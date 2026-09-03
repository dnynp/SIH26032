export default function Empty({ title, text, action }) {
  return <div className="empty"><div className="empty-icon">🌾</div><h3>{title}</h3><p>{text}</p>{action}</div>;
}
