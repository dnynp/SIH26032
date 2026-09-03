import Layout from "../../components/Layout";
import StatusBadge from "../../components/StatusBadge";
const rows=[["Yash","Rice","300 kg","₹25/kg","₹7,500","Completed"],["Yash","Wheat","500 kg","₹25/kg","₹12,500","Completed"],["Rahul","Soybean","200 kg","₹25/kg","₹5,000","Pending"]];
export default function Payments(){return <Layout><div className="page-head"><div><p className="eyebrow">SYSTEM PAYMENTS</p><h1>All Payments</h1></div></div><div className="card table-card"><table><thead><tr><th>Farmer</th><th>Crop</th><th>Quantity</th><th>Rate</th><th>Total</th><th>Status</th></tr></thead><tbody>{rows.map((r,i)=><tr key={i}><td><b>{r[0]}</b></td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td><b>{r[4]}</b></td><td><StatusBadge status={r[5]}/></td></tr>)}</tbody></table></div></Layout>}
