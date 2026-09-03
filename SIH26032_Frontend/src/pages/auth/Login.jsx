import React from "react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Phone, Sprout } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [mobile,setMobile] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");

  const go = (u) => navigate(`/${u.role.toLowerCase()}/dashboard`);
  const submit = async e => {
    e.preventDefault(); setError("");
    try { go(await login(mobile,password)); }
    catch { setError("Login failed. For presentation, use a demo role below."); }
  };

  return <div className="auth-page">
    <div className="auth-visual"><div className="auth-brand"><Sprout/> e-Kisan</div><h1>Sell your produce with confidence.</h1><p>Simple registration, transparent tokens, procurement tracking and payment updates.</p><div className="steps-mini"><span>🌾 Submit</span><span>🎫 Get Token</span><span>💰 Get Paid</span></div></div>
    <div className="auth-card">
      <div className="mobile-logo"><Sprout/> e-Kisan</div>
      <h2>Welcome back</h2><p className="muted">Login to continue to your portal.</p>
      <form onSubmit={submit}>
        <label>Mobile Number<input value={mobile} onChange={e=>setMobile(e.target.value)} placeholder="Enter mobile number" required/></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password" required/></label>
        {error && <div className="alert error">{error}</div>}
        <button className="btn primary full">Login</button>
      </form>
      <div className="divider"><span>or presentation demo</span></div>
      <div className="demo-buttons">
        <button onClick={()=>go(demoLogin("Farmer"))}>Farmer Demo</button>
        <button onClick={()=>go(demoLogin("Officer"))}>Officer Demo</button>
        <button onClick={()=>go(demoLogin("Admin"))}>Admin Demo</button>
      </div>
      <p className="center muted">New farmer? <Link to="/register">Register here</Link></p>
    </div>
  </div>
}
