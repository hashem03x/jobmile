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
      const { user, token, expiry } = JSON.parse(stored);
      // Check expiry
      if (expiry && Date.now() > expiry) {
        // Token expired
        localStorage.removeItem("auth");
        setUser(null);
        setToken(null);
      } else {
        setUser(user);
        setToken(token);
      }
    }
    setLoading(false);
  }, []);

  const login = (user, token) => {
    setUser(user);
    setToken(token);
    // Set expiry for 60 minutes from now
    const expiry = Date.now() + 60 * 60 * 1000;
    localStorage.setItem("auth", JSON.stringify({ user, token, expiry }));
  };

  const logout = () => {
    console.log("Logging out");
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth");
  };
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
