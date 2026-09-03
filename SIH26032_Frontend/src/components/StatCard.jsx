export default function StatCard({ icon, label, value, note }) {
  return <div className="stat-card"><div className="stat-icon">{icon}</div><div><p>{label}</p><h2>{value}</h2>{note && <small>{note}</small>}</div></div>;
}
