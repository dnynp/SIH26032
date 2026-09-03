import Layout from "../../components/Layout";
import StatusBadge from "../../components/StatusBadge";

const steps=[["Request Submitted","3 Sep, 9:20 AM",true],["Approved","3 Sep, 11:10 AM",true],["Scheduled","4 Sep, 10:00 AM",true],["Produce Procured","15 Sep",true],["Payment Created","15 Sep",true],["Payment Completed","15 Sep",true]];
export default function Status(){return <Layout><div className="page-head"><div><p className="eyebrow">TRACKING</p><h1>My Request Status</h1><p className="muted">Rice • 300 kg • Token #15</p></div><StatusBadge status="Procured"/></div><div className="card timeline-card">{steps.map((s,i)=><div className="timeline-item" key={s[0]}><div className={`timeline-dot ${s[2]?"done":""}`}>{s[2]?"✓":""}</div><div><h3>{s[0]}</h3><p>{s[1]}</p></div>{i===5&&<b className="timeline-end">₹7,500</b>}</div>)}</div></Layout>}
