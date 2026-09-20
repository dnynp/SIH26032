import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Wrap any route element with this. `roles` is optional — omit it to only
// require "logged in", or pass an array to also restrict by role.
// Reminder: this only hides/redirects on the frontend. The backend must
// reject unauthorized requests independently — this is not the security layer.
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="center mt-24">Loading…</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const userRole = user.role?.toLowerCase()
  const allowedRoles = roles ? roles.map((r) => r.toLowerCase()) : null

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to={`/${userRole}/dashboard`} replace />
  }

  return children
}
