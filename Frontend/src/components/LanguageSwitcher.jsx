import { Languages } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { LANGUAGES } from '../i18n/translations'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="row" style={{ gap: 6 }}>
      <Languages size={16} color="var(--muted)" />
      <select
        aria-label="Choose language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{ padding: '6px 8px', fontSize: '0.85rem' }}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </div>
  )
}
