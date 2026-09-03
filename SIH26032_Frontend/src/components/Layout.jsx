import { NavLink, useNavigate } from "react-router-dom";
import { Bell, CircleUserRound, LogOut, Menu, Sprout, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const links = {
  Farmer: [
    ["/farmer/dashboard","Dashboard"],
    ["/farmer/request/new","Submit Produce"],
    ["/farmer/requests","My Requests"],
    ["/farmer/notifications","Notifications"],
    ["/farmer/payments","Payments"],
    ["/farmer/profile","Profile"]
  ],
  Officer: [
    ["/officer/dashboard","Dashboard"],
    ["/officer/farmers","Farmers"],
    ["/officer/requests","Requests"],
    ["/officer/payments","Payments"]
  ],
  Admin: [
    ["/admin/dashboard","Dashboard"],
    ["/admin/farmers","Farmers"],
    ["/admin/requests","Requests"],
    ["/admin/payments","Payments"]
  ]
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const signOut = () => { logout(); navigate("/login"); };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand"><span className="brand-icon"><Sprout size={22}/></span><div><b>e-Kisan</b><small>Smart Procurement</small></div></div>
        <nav>
          {links[user.role].map(([to,label]) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              {label}
            </NavLink>
          ))}
        </nav>
        <button className="nav-item logout" onClick={signOut}><LogOut size={18}/> Logout</button>
      </aside>

      {open && <div className="overlay" onClick={() => setOpen(false)} />}
      <main className="main">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
          <div className="top-title">{user.role} Portal</div>
          <div className="top-actions">
            <select aria-label="Language"><option>English</option><option>हिंदी</option><option>मराठी</option></select>
            <Bell size={20}/>
            <CircleUserRound size={22}/>
            <span className="user-name">{user.name}</span>
          </div>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
