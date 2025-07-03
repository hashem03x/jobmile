import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { type: 'candidate'|'company', data: {...} }
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem("auth");
    if (stored) {
      const { user, token } = JSON.parse(stored);
      setUser(user);
      setToken(token);
    }
    setLoading(false);
  }, []);

  const login = (user, token) => {
    setUser(user);
    setToken(token);
  };

  const logout = () => {
    console.log("Logging out");
    setUser(null);
    setToken(null);
  };
  console.log(token);
  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
