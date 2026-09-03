import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { register } = useAuth(); const navigate = useNavigate();
  const [form,setForm]=useState({name:"",mobile:"",password:"",village:"",district:"",state:"Maharashtra"});
  const [msg,setMsg]=useState(""); const [error,setError]=useState("");
  const update=e=>setForm({...form,[e.target.name]:e.target.value});
  const submit=async e=>{e.preventDefault();setError("");try{await register(form);setMsg("Registration successful. Please login.");setTimeout(()=>navigate("/login"),900)}catch(err){setError(err?.response?.data?.message||"Registration failed.");}};
  return <div className="auth-page"><div className="auth-visual"><div className="auth-brand"><Sprout/> e-Kisan</div><h1>Welcome, farmer.</h1><p>Create your account and manage your produce procurement from one simple place.</p></div>
    <div className="auth-card wide"><h2>Farmer Registration</h2><p className="muted">Only farmer accounts are created through public registration.</p>
    <form className="form-grid" onSubmit={submit}>
      <label>Full Name<input name="name" value={form.name} onChange={update} required/></label>
      <label>Mobile Number<input name="mobile" value={form.mobile} onChange={update} required/></label>
      <label>Password<input type="password" name="password" value={form.password} onChange={update} required/></label>
      <label>Village<input name="village" value={form.village} onChange={update} required/></label>
      <label>District<input name="district" value={form.district} onChange={update} required/></label>
      <label>State<input name="state" value={form.state} onChange={update} required/></label>
      {error&&<div className="alert error span-2">{error}</div>}{msg&&<div className="alert success span-2">{msg}</div>}
      <button className="btn primary span-2">Create Farmer Account</button>
    </form><p className="center muted">Already registered? <Link to="/login">Login</Link></p></div></div>
}
