import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import StatusBadge from "../../components/StatusBadge";

const data=[["Rice","300 kg","#15","Pune Center","Scheduled","15 Sep 2026"],["Wheat","500 kg","#16","Pune Center","Procured","10 Sep 2026"],["Cotton","700 kg","#17","Nashik Center","Pending","—"],["Soybean","200 kg","#18","Pune Center","Procured","8 Sep 2026"]];
export default function Requests(){return <Layout><div className="page-head"><div><p className="eyebrow">MY PRODUCE</p><h1>My Requests</h1><p className="muted">View and track all your procurement requests.</p></div><Link className="btn primary" to="/farmer/request/new">+ New Request</Link></div><div className="card table-card"><table><thead><tr><th>Crop</th><th>Quantity</th><th>Token</th><th>Center</th><th>Status</th><th></th></tr></thead><tbody>{data.map((r,i)=><tr key={i}><td><b>{r[0]}</b><small>{r[5]}</small></td><td>{r[1]}</td><td><b>{r[2]}</b></td><td>{r[3]}</td><td><StatusBadge status={r[4]}/></td><td><Link to={`/farmer/status/${i}`}>View</Link></td></tr>)}</tbody></table></div></Layout>}
