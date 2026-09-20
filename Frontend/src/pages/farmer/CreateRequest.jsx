import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import Layout from '../../components/Layout'
import StatusBadge from '../../components/StatusBadge'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { createRequest } from '../../services/procurementService'

const UNITS = ['kg', 'quintal', 'tonne']

export default function CreateRequest() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [form, setForm] = useState({ cropName: '', quantity: '', unit: 'kg', procurementCenter: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    const next = {}
    if (!form.cropName.trim()) next.cropName = 'Crop name is required.'
    if (!form.quantity || Number(form.quantity) <= 0) next.quantity = 'Quantity must be greater than 0.'
    if (!form.procurementCenter.trim()) next.procurementCenter = 'Procurement centre is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return
    setLoading(true)
    try {
      const res = await createRequest({
        farmer: user?.farmer?._id || user?.userId,
        cropName: form.cropName.trim(),
        quantity: Number(form.quantity),
        unit: form.unit,
        procurementCenter: form.procurementCenter.trim(),
      })
      setCreated(res.data.request)
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not submit request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (created) {
    return (
      <Layout title={t('farmer.newRequestTitle')}>
        <div className="panel center" style={{ maxWidth: 440, margin: '40px auto' }}>
          <CheckCircle2 size={40} color="var(--leaf)" />
          <h2 className="mt-16">{t('farmer.requestSubmitted')}</h2>
          <p className="muted mt-8">{t('farmer.requestSubmittedBody')}</p>

          <div className="stack mt-24" style={{ textAlign: 'left' }}>
            <div className="row between"><span className="muted">{t('common.token')}</span><strong>#{created.tokenNumber}</strong></div>
            <div className="row between"><span className="muted">{t('common.centre')}</span><strong>{created.procurementCenter}</strong></div>
            <div className="row between"><span className="muted">{t('common.status')}</span><StatusBadge status={created.status || 'Pending'} /></div>
          </div>

          <div className="row mt-24" style={{ justifyContent: 'center' }}>
            <Link to={`/farmer/queue/${created._id}`} className="btn btn-primary">{t('farmer.viewQueue')}</Link>
            <Link to="/farmer/requests" className="btn btn-outline">{t('farmer.viewRequest')}</Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={t('farmer.newRequestTitle')}>
      <div className="panel" style={{ maxWidth: 480 }}>
        {serverError && <div className="alert alert-error">{serverError}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="cropName">{t('common.crop')}</label>
            <input id="cropName" name="cropName" placeholder="e.g. Wheat" value={form.cropName} onChange={handleChange} className={errors.cropName ? 'invalid' : ''} />
            {errors.cropName && <span className="error">{errors.cropName}</span>}
          </div>

          <div className="row" style={{ alignItems: 'flex-start' }}>
            <div className="field" style={{ flex: 2 }}>
              <label htmlFor="quantity">{t('common.quantity')}</label>
              <input id="quantity" name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} className={errors.quantity ? 'invalid' : ''} />
              {errors.quantity && <span className="error">{errors.quantity}</span>}
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="unit">{t('farmer.unit')}</label>
              <select id="unit" name="unit" value={form.unit} onChange={handleChange}>
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="procurementCenter">{t('common.centre')}</label>
            <input id="procurementCenter" name="procurementCenter" placeholder="e.g. ABC Procurement Centre" value={form.procurementCenter} onChange={handleChange} className={errors.procurementCenter ? 'invalid' : ''} />
            {errors.procurementCenter && <span className="error">{errors.procurementCenter}</span>}
          </div>

          <button className="btn btn-accent btn-block" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : t('farmer.submitRequest')}
          </button>
        </form>
      </div>
    </Layout>
  )
}
