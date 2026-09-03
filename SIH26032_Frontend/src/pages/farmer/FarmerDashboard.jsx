import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, CircleCheck, Clock3, FileText, IndianRupee, Ticket } from "lucide-react";
import Layout from "../../components/Layout";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";

export default function FarmerDashboard() {
 const {user}=useAuth();
 return <Layout><div className="page-head"><div><p className="eyebrow">FARMER HOME</p><h1>Namaste, {user.name} 👋</h1><p className="muted">Manage your produce procurement in one place.</p></div><Link className="btn primary" to="/farmer/request/new">+ Submit Produce</Link></div>
 <div className="stats"><StatCard icon={<FileText/>} label="My Requests" value="5"/><StatCard icon={<Clock3/>} label="Pending" value="1"/><StatCard icon={<CalendarDays/>} label="Scheduled" value="1"/><StatCard icon={<CircleCheck/>} label="Procured" value="3"/></div>
 <div className="dashboard-grid">
  <section className="card current-card"><div className="card-head"><h3>Current Procurement</h3><StatusBadge status="Scheduled"/></div><div className="request-highlight"><div><span className="label">Crop</span><strong>Rice</strong></div><div><span className="label">Quantity</span><strong>300 kg</strong></div><div><span className="label">Center</span><strong>Pune Center</strong></div></div><div className="token-row"><div><span>Your Token</span><b>#15</b></div><div><span>Scheduled</span><b>15 Sep, 10:00 AM</b></div></div><Link className="btn outline" to="/farmer/status/demo">Track My Request <ArrowRight size={17}/></Link></section>
  <section className="card token-card"><Ticket size={30}/><p>Your Token</p><div className="big-token">#15</div><p>4 farmers ahead of you</p><Link to="/farmer/queue/demo" className="btn light">View My Turn</Link></section>
 </div>
 <section className="card"><div className="card-head"><h3>Recent Updates</h3><Link to="/farmer/notifications">View all</Link></div><div className="notification-row"><span>🎉</span><div><b>Request approved</b><p>Your Rice request has been approved.</p></div><small>Today</small></div><div className="notification-row"><span>📅</span><div><b>Procurement scheduled</b><p>15 September at 10:00 AM.</p></div><small>Yesterday</small></div></section>
 </Layout>
}
