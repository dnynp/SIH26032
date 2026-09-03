export default function StatusBadge({ status }) {
  const cls = {
    Pending: "status pending",
    Approved: "status approved",
    Scheduled: "status scheduled",
    Procured: "status procured",
    Rejected: "status rejected",
    Completed: "status procured",
    Failed: "status rejected"
  }[status] || "status";
  return <span className={cls}>{status}</span>;
}
