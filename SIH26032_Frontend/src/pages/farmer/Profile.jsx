import Layout from "../../components/Layout";
import { CircleUserRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
export default function Profile(){const {user}=useAuth();return <Layout><div className="page-head"><div><p className="eyebrow">MY ACCOUNT</p><h1>Profile</h1></div></div><div className="card profile-card"><CircleUserRound size={70}/><h2>{user.name}</h2><p className="muted">Farmer</p><div className="profile-grid"><div><small>Mobile</small><b>{user.mobile}</b></div><div><small>Village</small><b>Example Village</b></div><div><small>District</small><b>Pune</b></div><div><small>State</small><b>Maharashtra</b></div></div></div></Layout>}
