import React, { createContext, useContext, useEffect, useState } from "react";
import { loginApi, registerApi } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) || null; }
    catch { return null; }
  });

  const login = async (mobile, password) => {
    const { data } = await loginApi({ mobile, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const demoLogin = (role) => {
    const demo = {
      Farmer: { id: "demo-farmer", name: "Yash", mobile: "8888888888", role: "Farmer", farmer: "demo-farmer" },
      Officer: { id: "demo-officer", name: "Procurement Officer", mobile: "6666666666", role: "Officer" },
      Admin: { id: "demo-admin", name: "System Admin", mobile: "9999999998", role: "Admin" }
    }[role];
    localStorage.setItem("token", `demo-${role.toLowerCase()}`);
    localStorage.setItem("user", JSON.stringify(demo));
    setUser(demo);
    return demo;
  };

  const register = async (data) => {
    const { data: response } = await registerApi(data);
    return response;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const handler = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    };
    window.addEventListener("auth:logout", handler);
    return () => window.removeEventListener("auth:logout", handler);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, demoLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
