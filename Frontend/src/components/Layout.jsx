import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FilePlus2, ListChecks, Clock, Activity,
  Bell, Wallet, User, Users, LogOut, Landmark,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

// Each role sees a different set of nav links, matching the pages that
// actually exist for that role. `labelKey` is looked up through t() so
// the sidebar renders in whichever language is selected.
const NAV_BY_ROLE = {
  farmer: [
    { to: '/farmer/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
    { to: '/farmer/create-request', labelKey: 'nav.newRequest', icon: FilePlus2 },
    { to: '/farmer/requests', labelKey: 'nav.myRequests', icon: ListChecks },
    { to: '/farmer/queue', labelKey: 'nav.queue', icon: Clock },
    { to: '/farmer/status', labelKey: 'nav.status', icon: Activity },
    { to: '/farmer/notifications', labelKey: 'nav.notifications', icon: Bell },
    { to: '/farmer/payments', labelKey: 'nav.payments', icon: Wallet },
    { to: '/farmer/profile', labelKey: 'nav.profile', icon: User },
  ],
  officer: [
    { to: '/officer/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
    { to: '/officer/requests', labelKey: 'nav.requestsQueue', icon: ListChecks },
    { to: '/officer/farmers', labelKey: 'nav.farmers', icon: Users },
    { to: '/officer/payments', labelKey: 'nav.payments', icon: Wallet },
  ],
  admin: [
    { to: '/admin/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
    { to: '/admin/requests', labelKey: 'nav.requests', icon: ListChecks },
    { to: '/admin/farmers', labelKey: 'nav.farmers', icon: Users },
    { to: '/admin/payments', labelKey: 'nav.payments', icon: Wallet },
  ],
}

export default function Layout({ title, children }) {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const role = user?.role?.toLowerCase()
  const links = NAV_BY_ROLE[role] || []

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Landmark size={22} />
          <div>
            <strong>Kisan Setu</strong>
            <span>Procurement Platform</span>
          </div>
        </div>
        <nav>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <link.icon size={17} />
              {t(link.labelKey)}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="navlink" onClick={handleLogout}>
            <LogOut size={17} />
            {t('common.logout')}
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <h1>{title}</h1>
          <div className="row text-sm muted">
            <LanguageSwitcher />
            {user?.farmer?.name || user?.name || user?.mobile}
            <span className="badge badge-approved" style={{ textTransform: 'capitalize' }}>
              {user?.role}
            </span>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  )
}
