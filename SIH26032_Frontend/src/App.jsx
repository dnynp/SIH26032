import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import CreateRequest from "./pages/farmer/CreateRequest";
import FarmerRequests from "./pages/farmer/Requests";
import Queue from "./pages/farmer/Queue";
import Status from "./pages/farmer/Status";
import Notifications from "./pages/farmer/Notifications";
import FarmerPayments from "./pages/farmer/Payments";
import Profile from "./pages/farmer/Profile";
import OfficerDashboard from "./pages/officer/OfficerDashboard";
import OfficerFarmers from "./pages/officer/Farmers";
import OfficerRequests from "./pages/officer/Requests";
import OfficerPayments from "./pages/officer/Payments";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFarmers from "./pages/admin/Farmers";
import AdminRequests from "./pages/admin/Requests";
import AdminPayments from "./pages/admin/Payments";

function RoleHome(){const {user}=useAuth(); if(!user)return <Navigate to="/"/>; return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace/>}

export default function App(){
 return <Routes>
  <Route path="/" element={<Landing/>}/>
  <Route path="/login" element={<Login/>}/>
  <Route path="/register" element={<Register/>}/>
  <Route path="/farmer/dashboard" element={<ProtectedRoute roles={["Farmer"]}><FarmerDashboard/></ProtectedRoute>}/>
  <Route path="/farmer/request/new" element={<ProtectedRoute roles={["Farmer"]}><CreateRequest/></ProtectedRoute>}/>
  <Route path="/farmer/requests" element={<ProtectedRoute roles={["Farmer"]}><FarmerRequests/></ProtectedRoute>}/>
  <Route path="/farmer/queue/:id" element={<ProtectedRoute roles={["Farmer"]}><Queue/></ProtectedRoute>}/>
  <Route path="/farmer/status/:id" element={<ProtectedRoute roles={["Farmer"]}><Status/></ProtectedRoute>}/>
  <Route path="/farmer/notifications" element={<ProtectedRoute roles={["Farmer"]}><Notifications/></ProtectedRoute>}/>
  <Route path="/farmer/payments" element={<ProtectedRoute roles={["Farmer"]}><FarmerPayments/></ProtectedRoute>}/>
  <Route path="/farmer/profile" element={<ProtectedRoute roles={["Farmer"]}><Profile/></ProtectedRoute>}/>
  <Route path="/officer/dashboard" element={<ProtectedRoute roles={["Officer"]}><OfficerDashboard/></ProtectedRoute>}/>
  <Route path="/officer/farmers" element={<ProtectedRoute roles={["Officer"]}><OfficerFarmers/></ProtectedRoute>}/>
  <Route path="/officer/requests" element={<ProtectedRoute roles={["Officer"]}><OfficerRequests/></ProtectedRoute>}/>
  <Route path="/officer/payments" element={<ProtectedRoute roles={["Officer"]}><OfficerPayments/></ProtectedRoute>}/>
  <Route path="/admin/dashboard" element={<ProtectedRoute roles={["Admin"]}><AdminDashboard/></ProtectedRoute>}/>
  <Route path="/admin/farmers" element={<ProtectedRoute roles={["Admin"]}><AdminFarmers/></ProtectedRoute>}/>
  <Route path="/admin/requests" element={<ProtectedRoute roles={["Admin"]}><AdminRequests/></ProtectedRoute>}/>
  <Route path="/admin/payments" element={<ProtectedRoute roles={["Admin"]}><AdminPayments/></ProtectedRoute>}/>
  <Route path="/home" element={<RoleHome/>}/>
  <Route path="*" element={<Navigate to="/" replace/>}/>
 </Routes>
}
