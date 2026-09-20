export default function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="panel panel-accent" style={accent ? { borderLeftColor: accent } : undefined}>
      <div className="row between">
        <div className="panel-title">{label}</div>
        {Icon && <Icon size={18} color="var(--muted)" />}
      </div>
      <div className="big-number">{value}</div>
    </div>
  )
}
