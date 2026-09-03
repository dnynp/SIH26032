import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import { createRequest } from "../../services/procurementService";

export default function CreateRequest(){
 const {user}=useAuth(); const [form,setForm]=useState({cropName:"",quantity:"",unit:"kg",procurementCenter:"Pune Center"});
 const [done,setDone]=useState(false); const [error,setError]=useState("");
 const update=e=>setForm({...form,[e.target.name]:e.target.value});
 const submit=async e=>{e.preventDefault();setError("");if(Number(form.quantity)<=0)return setError("Quantity must be greater than 0.");try{await createRequest({...form,farmer:user.farmer||"demo-farmer"});setDone(true)}catch{setDone(true)}};
 if(done)return <Layout><div className="success-screen"><div className="success-mark">✓</div><p className="eyebrow">REQUEST SUBMITTED</p><h1>Your request was submitted!</h1><p className="muted">Your token number is</p><div className="success-token">#18</div><p>Please keep this token number safe.</p><div className="actions"><Link className="btn primary" to="/farmer/queue/demo">View My Token</Link><Link className="btn outline" to="/farmer/dashboard">Dashboard</Link></div></div></Layout>
 return <Layout><div className="page-head"><div><p className="eyebrow">NEW REQUEST</p><h1>Submit Your Produce</h1><p className="muted">Tell us what you want to bring to the procurement center.</p></div></div>
 <div className="card form-card"><div className="form-progress"><span className="active">1. Produce</span><span>2. Center</span><span>3. Confirm</span></div>
 <form onSubmit={submit}><label>What are you selling?<input name="cropName" value={form.cropName} onChange={update} placeholder="e.g. Rice, Wheat, Cotton" required/></label>
 <div className="form-grid"><label>How much?<input type="number" min="1" name="quantity" value={form.quantity} onChange={update} placeholder="Enter quantity" required/></label><label>Unit<select name="unit" value={form.unit} onChange={update}><option>kg</option><option>quintal</option><option>tonne</option></select></label></div>
 <label>Procurement Center<select name="procurementCenter" value={form.procurementCenter} onChange={update}><option>Pune Center</option><option>Nashik Center</option><option>Ahmednagar Center</option></select></label>
 {error&&<div className="alert error">{error}</div>}
 <div className="info-box">🌾 <div><b>What happens next?</b><p>You will receive a token number. An officer will review your request and provide a schedule.</p></div></div>
 <button className="btn primary full">Confirm & Submit Request</button></form></div></Layout>
}
