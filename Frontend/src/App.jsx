import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'

import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import RefundPolicy from './pages/RefundPolicy'
import Terms from './pages/Terms'
import PrivacyPolicy from './pages/PrivacyPolicy'

import FarmerDashboard from './pages/farmer/Dashboard'
import CreateRequest from './pages/farmer/CreateRequest'
import FarmerRequests from './pages/farmer/Requests'
import FarmerQueue from './pages/farmer/Queue'
import FarmerStatus from './pages/farmer/Status'
import FarmerNotifications from './pages/farmer/Notifications'
import FarmerPayments from './pages/farmer/Payments'
import FarmerProfile from './pages/farmer/Profile'

import OfficerDashboard from './pages/officer/Dashboard'
import OfficerFarmers from './pages/officer/Farmers'
import OfficerRequests from './pages/officer/Requests'
import OfficerPayments from './pages/officer/Payments'

import AdminDashboard from './pages/admin/Dashboard'
import AdminFarmers from './pages/admin/Farmers'
import AdminRequests from './pages/admin/Requests'
import AdminPayments from './pages/admin/Payments'

// Sends a logged-in user straight to their own dashboard, and everyone
// else to the landing page.
function HomeRedirect() {
  const { user } = useAuth()
  if (user) {
    const role = (user.role || 'farmer').toLowerCase()
    return <Navigate to={`/${role}/dashboard`} replace />
  }
  return <Landing />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />

      {/* Farmer */}
      <Route path="/farmer/dashboard" element={<ProtectedRoute roles={['farmer']}><FarmerDashboard /></ProtectedRoute>} />
      <Route path="/farmer/create-request" element={<ProtectedRoute roles={['farmer']}><CreateRequest /></ProtectedRoute>} />
      <Route path="/farmer/requests" element={<ProtectedRoute roles={['farmer']}><FarmerRequests /></ProtectedRoute>} />
      <Route path="/farmer/queue" element={<ProtectedRoute roles={['farmer']}><FarmerQueue /></ProtectedRoute>} />
      <Route path="/farmer/queue/:id" element={<ProtectedRoute roles={['farmer']}><FarmerQueue /></ProtectedRoute>} />
      <Route path="/farmer/status" element={<ProtectedRoute roles={['farmer']}><FarmerStatus /></ProtectedRoute>} />
      <Route path="/farmer/status/:id" element={<ProtectedRoute roles={['farmer']}><FarmerStatus /></ProtectedRoute>} />
      <Route path="/farmer/notifications" element={<ProtectedRoute roles={['farmer']}><FarmerNotifications /></ProtectedRoute>} />
      <Route path="/farmer/payments" element={<ProtectedRoute roles={['farmer']}><FarmerPayments /></ProtectedRoute>} />
      <Route path="/farmer/profile" element={<ProtectedRoute roles={['farmer']}><FarmerProfile /></ProtectedRoute>} />

      {/* Officer */}
      <Route path="/officer/dashboard" element={<ProtectedRoute roles={['officer']}><OfficerDashboard /></ProtectedRoute>} />
      <Route path="/officer/requests" element={<ProtectedRoute roles={['officer']}><OfficerRequests /></ProtectedRoute>} />
      <Route path="/officer/farmers" element={<ProtectedRoute roles={['officer']}><OfficerFarmers /></ProtectedRoute>} />
      <Route path="/officer/payments" element={<ProtectedRoute roles={['officer']}><OfficerPayments /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/requests" element={<ProtectedRoute roles={['admin']}><AdminRequests /></ProtectedRoute>} />
      <Route path="/admin/farmers" element={<ProtectedRoute roles={['admin']}><AdminFarmers /></ProtectedRoute>} />
      <Route path="/admin/payments" element={<ProtectedRoute roles={['admin']}><AdminPayments /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
