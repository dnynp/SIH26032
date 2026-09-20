import { createContext, useContext, useEffect, useState } from 'react'
import { translations } from '../i18n/translations'

const LanguageContext = createContext(null)

function lookup(dict, path) {
  return path.split('.').reduce((obj, key) => (obj ? obj[key] : undefined), dict)
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => localStorage.getItem('language') || 'en')

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const setLanguage = (code) => {
    if (translations[code]) setLanguageState(code)
  }

  // t('nav.dashboard') looks up translations[language].nav.dashboard, and
  // falls back to English (then the key itself) so a missing translation
  // never renders blank.
  const t = (key) => {
    return (
      lookup(translations[language], key) ||
      lookup(translations.en, key) ||
      key
    )
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside a LanguageProvider')
  return ctx
}
