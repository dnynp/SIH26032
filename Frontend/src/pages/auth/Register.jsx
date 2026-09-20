import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Landmark } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import LanguageSwitcher from '../../components/LanguageSwitcher'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Bihar', 'Chhattisgarh', 'Gujarat', 'Haryana', 'Karnataka',
  'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu',
  'Uttar Pradesh', 'West Bengal',
]

const EMPTY_FORM = {
  name: '', mobile: '', password: '', village: '', district: '', state: '',
}

export default function Register() {
  const { registerFarmer } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required.'
    if (!/^[6-9]\d{9}$/.test(form.mobile)) next.mobile = 'Enter a valid 10-digit mobile number.'
    if (!form.password || form.password.length < 6) next.password = 'Password must be at least 6 characters.'
    if (!form.village.trim()) next.village = 'Village is required.'
    if (!form.district.trim()) next.district = 'District is required.'
    if (!form.state) next.state = 'State is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return
    setLoading(true)
    try {
      await registerFarmer(form)
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 480 }}>
        <div className="row" style={{ justifyContent: 'flex-end', marginBottom: 8 }}>
          <LanguageSwitcher />
        </div>
        <div className="auth-brand">
          <Landmark size={28} color="var(--navy)" />
          <strong>Kisan Setu</strong>
          <span>{t('auth.registerTitle')}</span>
        </div>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">{t('auth.name')}</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} className={errors.name ? 'invalid' : ''} />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="field">
            <label htmlFor="mobile">{t('auth.mobile')}</label>
            <input id="mobile" name="mobile" type="tel" value={form.mobile} onChange={handleChange} className={errors.mobile ? 'invalid' : ''} />
            {errors.mobile && <span className="error">{errors.mobile}</span>}
          </div>

          <div className="field">
            <label htmlFor="password">{t('auth.password')}</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} className={errors.password ? 'invalid' : ''} />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <div className="field">
            <label htmlFor="village">{t('auth.village')}</label>
            <input id="village" name="village" value={form.village} onChange={handleChange} className={errors.village ? 'invalid' : ''} />
            {errors.village && <span className="error">{errors.village}</span>}
          </div>

          <div className="field">
            <label htmlFor="district">{t('auth.district')}</label>
            <input id="district" name="district" value={form.district} onChange={handleChange} className={errors.district ? 'invalid' : ''} />
            {errors.district && <span className="error">{errors.district}</span>}
          </div>

          <div className="field">
            <label htmlFor="state">{t('auth.state')}</label>
            <select id="state" name="state" value={form.state} onChange={handleChange} className={errors.state ? 'invalid' : ''}>
              <option value="">{t('auth.selectState')}</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <span className="error">{errors.state}</span>}
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : t('auth.registerButton')}
          </button>
        </form>

        <p className="text-sm center mt-16 muted">
          {t('auth.haveAccount')} <Link to="/login">{t('auth.loginHere')}</Link>
        </p>
      </div>
    </div>
  )
}
