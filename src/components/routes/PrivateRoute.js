import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppMenu from "../ui/AppMenu";

export default function PrivateRoute({ children, ...rest }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const path = location.pathname;
  // Only allow candidate users to access /candidate/*
  if (user?.user_type === "candidate" && path.startsWith("/company")) {
    return <Navigate to="/candidate/home" replace />;
  }
  // Only allow company users to access /company/*
  if (user?.user_type === "company" && path.startsWith("/candidate")) {
    return <Navigate to="/company/home" replace />;
  }
  return children ? (
    children
  ) : (
    <>
      <AppMenu />
      <Outlet />
    </>
  );
}
