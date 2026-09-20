import { useEffect, useState } from 'react'
import { CheckCircle2, ClipboardCheck, Scale, Play, MapPin } from 'lucide-react'
import Layout from '../../components/Layout'
import StatusBadge from '../../components/StatusBadge'
import Empty from '../../components/Empty'
import { getRequests, updateRequestStatus, markProcured, markArrived, saveQualityCheck, saveWeight, startProcessing } from '../../services/procurementService'

function QualityForm({ request, run }) {
  const [form, setForm] = useState({ qualityStatus: 'Approved', moisture: '', grade: 'A', remarks: '' })
  return <div className="operations-form"><strong><ClipboardCheck size={15}/> Quality check</strong><div className="row mt-8"><select value={form.qualityStatus} onChange={e=>setForm({...form,qualityStatus:e.target.value})}><option>Approved</option><option>Rejected</option></select><input type="number" min="0" max="100" placeholder="Moisture %" value={form.moisture} onChange={e=>setForm({...form,moisture:e.target.value})}/><select value={form.grade} onChange={e=>setForm({...form,grade:e.target.value})}><option>A</option><option>B</option><option>C</option></select></div><input className="mt-8" placeholder="Remarks (optional)" value={form.remarks} onChange={e=>setForm({...form,remarks:e.target.value})}/><button className="btn btn-primary btn-sm mt-8" onClick={()=>run(request._id,'quality',form)}>Save quality check</button></div>
}

function Operations({ request, run, busy }) {
  if (request.status !== 'Scheduled') return null
  return <div className="operations-panel">
    <div className="panel-title">Centre workflow</div>
    <div className="operations-steps"><span className={request.arrivalStatus==='Arrived'?'done':''}>1. Arrived</span><span className={request.qualityStatus==='Approved'?'done':''}>2. Quality</span><span className={request.weighedAt?'done':''}>3. Weighed</span><span className={request.processingStartedAt?'done':''}>4. Processing</span></div>
    {request.arrivalStatus !== 'Arrived' && <button className="btn btn-outline btn-sm" disabled={busy} onClick={()=>run(request._id,'arrive')}>Mark farmer arrived</button>}
    {request.arrivalStatus === 'Arrived' && !request.checkedAt && <QualityForm request={request} run={run}/>} 
    {request.qualityStatus === 'Rejected' && <div className="alert alert-error mt-8">Quality rejected. Procurement cannot continue.</div>}
    {request.qualityStatus === 'Approved' && !request.weighedAt && <div className="operations-form"><strong><Scale size={15}/> Weighing</strong><p className="text-sm muted mt-8">Expected quantity: {request.quantity} {request.unit || 'kg'}</p><input id={`weight-${request._id}`} className="mt-8" type="number" min="0.01" placeholder="Actual weight"/><button className="btn btn-primary btn-sm mt-8" onClick={()=>run(request._id,'weigh',document.getElementById(`weight-${request._id}`).value)}>Save weight</button></div>}
    {request.weighedAt && !request.processingStartedAt && <button className="btn btn-accent btn-sm" disabled={busy} onClick={()=>run(request._id,'start')}><Play size={14}/> Start procurement</button>}
    {request.processingStartedAt && <button className="btn btn-primary btn-sm" disabled={busy} onClick={()=>run(request._id,'procure')}><CheckCircle2 size={14}/> Complete procurement</button>}
  </div>
}

export default function OfficerRequests() {
  const [requests, setRequests] = useState([]); const [loading, setLoading] = useState(true); const [busyId, setBusyId] = useState(null); const [error, setError] = useState(''); const [filter,setFilter]=useState('All')
  const load = () => { setLoading(true); return getRequests().then(res=>setRequests(res.data||[])).catch(()=>setError('Unable to load procurement requests.')).finally(()=>setLoading(false)) }
  useEffect(()=>{load()},[])
  const run = async (id, action, data) => { setError('');setBusyId(id);try { if(action==='procure') await markProcured(id); else if(action==='arrive') await markArrived(id); else if(action==='quality') await saveQualityCheck(id,data); else if(action==='weigh') await saveWeight(id,data); else if(action==='start') await startProcessing(id); else await updateRequestStatus(id,action); await load() } catch(err){setError(err.response?.data?.message||'Action failed. Please try again.')}finally{setBusyId(null)} }
  const visible=requests.filter(r=>filter==='All'||r.status===filter||(filter==='Arrived'&&r.arrivalStatus==='Arrived')||(filter==='Processing'&&r.processingStartedAt))
  return <Layout title="Officer operations"><div className="row between"><div><h2>Today's procurement queue</h2><p className="muted text-sm mt-8">Complete each verified step before procurement payment.</p></div><select style={{width:160}} value={filter} onChange={e=>setFilter(e.target.value)}>{['All','Pending','Approved','Scheduled','Arrived','Processing','Procured','Rejected'].map(s=><option key={s}>{s}</option>)}</select></div>{error&&<div className="alert alert-error mt-16">{error}</div>}{loading&&<p className="muted mt-24">Loading requests…</p>}{!loading&&!visible.length&&<div className="panel mt-24"><Empty title="No matching requests" /></div>}<div className="stack mt-24">{visible.map(r=><article className="panel officer-request" key={r._id}><div className="row between"><div><div className="row"><strong>Token #{r.tokenNumber}</strong><StatusBadge status={r.status}/></div><p className="text-sm muted mt-8">{r.farmer?.name||'Farmer'} · {r.cropName} · {r.quantity} {r.unit||'kg'} · <MapPin size={13}/> {r.procurementCenter}</p></div>{r.status==='Pending'&&<div className="row"><button className="btn btn-primary btn-sm" disabled={busyId===r._id} onClick={()=>run(r._id,'Approved')}>Approve</button><button className="btn btn-danger btn-sm" disabled={busyId===r._id} onClick={()=>run(r._id,'Rejected')}>Reject</button></div>}{r.status==='Approved'&&<button className="btn btn-accent btn-sm" disabled={busyId===r._id} onClick={()=>run(r._id,'Scheduled')}>Schedule</button>}</div><Operations request={r} run={run} busy={busyId===r._id}/></article>)}</div></Layout>
}
