import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Landmark } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import LanguageSwitcher from '../../components/LanguageSwitcher'

export default function Login() {
  const { login } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [form, setForm] = useState({ mobile: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form)
      const role = (user.role || 'farmer').toLowerCase()
      navigate(`/${role}/dashboard`)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid mobile number or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="row" style={{ justifyContent: 'flex-end', marginBottom: 8 }}>
          <LanguageSwitcher />
        </div>
        <div className="auth-brand">
          <Landmark size={28} color="var(--navy)" />
          <strong>Kisan Setu</strong>
          <span>{t('auth.loginTitle')}</span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="mobile">{t('auth.mobile')}</label>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              required
              placeholder={t('auth.mobileHint')}
              value={form.mobile}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder={t('auth.password')}
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : t('auth.loginButton')}
          </button>
        </form>

        <p className="text-sm center mt-16 muted">
          {t('auth.noAccount')} <Link to="/register">{t('auth.registerHere')}</Link>
        </p>
      </div>
    </div>
  )
}
