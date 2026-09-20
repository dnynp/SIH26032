import { useEffect, useState } from 'react'
import { ShieldCheck, ShieldAlert, PhoneCall, Pencil, Save } from 'lucide-react'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { getMyProfile, updateMyProfile } from '../../services/farmerService'

const VOICE_PREF_KEY = 'voiceCallPref'
const emptyProfile = { name: '', mobile: '', village: '', district: '', state: '' }

export default function FarmerProfile() {
  const { user, updateStoredUser } = useAuth()
  const { t, language } = useLanguage()
  const [profile, setProfile] = useState(emptyProfile)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [verified, setVerified] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(() => localStorage.getItem(VOICE_PREF_KEY) === 'true')

  useEffect(() => {
    getMyProfile().then((res) => {
      const farmer = res.data.farmer
      const account = res.data.user || user
      setProfile({
        name: farmer?.name || account?.name || '', mobile: farmer?.mobile || account?.mobile || '',
        village: farmer?.village || '', district: farmer?.district || '', state: farmer?.state || '',
      })
      if (!farmer) setEditing(true)
    }).catch(() => setError('Unable to load profile details.')).finally(() => setLoading(false))
  }, [])

  const saveProfile = async (event) => {
    event.preventDefault(); setError(''); setSuccess('')
    if (Object.values(profile).some((value) => !value.trim())) { setError('Please complete every profile field.'); return }
    setSaving(true)
    try {
      const res = await updateMyProfile(profile)
      updateStoredUser({ ...user, ...res.data.user, farmer: res.data.farmer })
      setProfile(res.data.farmer); setEditing(false); setSuccess('Profile saved successfully.')
    } catch (err) { setError(err.response?.data?.message || 'Unable to save profile.') } finally { setSaving(false) }
  }

  const toggleVoicePref = () => { const next = !voiceEnabled; setVoiceEnabled(next); localStorage.setItem(VOICE_PREF_KEY, String(next)) }
  const fields = [['name', 'Full name'], ['mobile', 'Mobile number'], ['village', 'Village'], ['district', 'District'], ['state', 'State']]

  return <Layout title={t('nav.profile')}><div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
    <div className="panel">
      <div className="row between"><div className="panel-title">Farmer details</div>{!loading && !editing && <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}><Pencil size={14}/> Edit</button>}</div>
      {error && <div className="alert alert-error mt-16">{error}</div>}{success && <div className="alert alert-success mt-16">{success}</div>}
      {loading ? <p className="muted mt-16">Loading profile…</p> : editing ? <form className="mt-16" onSubmit={saveProfile}>{fields.map(([key, label]) => <div className="field" key={key}><label htmlFor={key}>{label}</label><input id={key} value={profile[key]} onChange={(e) => setProfile({ ...profile, [key]: e.target.value })} /></div>)}<div className="row"><button className="btn btn-primary" disabled={saving} type="submit">{saving ? 'Saving…' : <><Save size={15}/> Save profile</>}</button>{user?.farmer && <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>}</div></form> : <div className="stack mt-16 text-sm">{fields.map(([key,label]) => <div className="row between" key={key}><span className="muted">{label}</span><strong>{profile[key] || '—'}</strong></div>)}</div>}
    </div>
    <div className="stack"><div className="panel"><div className="row between"><div className="panel-title">{t('farmer.identityVerification')}</div>{verified ? <ShieldCheck size={18} color="var(--leaf)" /> : <ShieldAlert size={18} color="var(--wheat)" />}</div><p className="text-sm mt-8">{verified ? 'Your identity has been verified.' : 'Verify your identity to speed up officer checks at the procurement centre.'}</p><div className="alert" style={{background:'var(--paper)',color:'var(--muted)',border:'1px dashed var(--border-strong)'}}>Prototype only: production builds should use an authorised DigiLocker integration. No Aadhaar or document data is collected here.</div>{!verified && <button className="btn btn-outline mt-8" onClick={() => setVerified(true)}>Simulate DigiLocker verification</button>}</div>
      <div className="panel"><div className="row between"><div className="panel-title">{t('farmer.notificationPrefs')}</div><PhoneCall size={18} color={voiceEnabled ? 'var(--leaf)' : 'var(--muted)'} /></div><div className="row between mt-8"><div style={{maxWidth:320}}><p className="text-sm">Call me when my turn is near</p><p className="text-sm muted mt-8">Get an automated voice call in {language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English'} a few tokens before yours.</p></div><button className={voiceEnabled ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'} onClick={toggleVoicePref}>{voiceEnabled ? 'On' : 'Off'}</button></div><div className="alert mt-16" style={{background:'var(--paper)',color:'var(--muted)',border:'1px dashed var(--border-strong)'}}>Concept preview only: this preference is saved on this device and is not connected to a live calling system.</div></div>
    </div></div></Layout>
}
