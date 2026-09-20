import { createContext, useContext, useEffect, useState } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

// Reads the stored user/token once on load so a page refresh doesn't log
// the person out. The token itself is verified by the backend on every
// request — this is only what the UI needs to render the right screen.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        if (parsed?.role) parsed.role = parsed.role.toLowerCase()
        setUser(parsed)
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    const res = await authService.login(credentials)
    const { token, user: loggedInUser } = res.data
    const normalizedUser = {
      ...loggedInUser,
      role: loggedInUser.role ? loggedInUser.role.toLowerCase() : 'farmer',
    }
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(normalizedUser))
    setUser(normalizedUser)
    return normalizedUser
  }

  const registerFarmer = async (data) => {
    const res = await authService.register(data)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const updateStoredUser = (nextUser) => {
    const normalizedUser = { ...nextUser, role: nextUser.role?.toLowerCase() || 'farmer' }
    localStorage.setItem('user', JSON.stringify(normalizedUser))
    setUser(normalizedUser)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, registerFarmer, logout, updateStoredUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider')
  return ctx
}
