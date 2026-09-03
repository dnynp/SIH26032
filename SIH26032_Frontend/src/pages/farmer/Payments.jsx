import Layout from "../../components/Layout";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import { IndianRupee, Clock3 } from "lucide-react";

export default function Payments(){return <Layout><div className="page-head"><div><p className="eyebrow">MONEY</p><h1>My Payments</h1><p className="muted">Track payments for your procured produce.</p></div></div><div className="stats two"><StatCard icon={<IndianRupee/>} label="Total Received" value="₹25,000"/><StatCard icon={<Clock3/>} label="Pending Payments" value="₹0"/></div><div className="payment-grid">{[["Rice","300 kg","₹25/kg","₹7,500","Completed"],["Wheat","500 kg","₹25/kg","₹12,500","Completed"],["Soybean","200 kg","₹25/kg","₹5,000","Completed"]].map((p,i)=><div className="card payment-card" key={i}><div className="card-head"><div><h3>{p[0]}</h3><p>{p[1]}</p></div><StatusBadge status={p[4]}/></div><div className="payment-details"><span>Rate <b>{p[2]}</b></span><span>Total <strong>{p[3]}</strong></span></div><small>Payment completed successfully</small></div>)}</div></Layout>}
