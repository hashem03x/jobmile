import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppMenu from "../ui/AppMenu";

export default function PrivateRoute({ children, ...rest }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  // Route protection by user_type
  const path = location.pathname;
  if (user?.user_type === "candidate" && path.startsWith("/dashboard/company")) {
    return <Navigate to="/dashboard/candidate" replace />;
  }
  if (user?.user_type === "company" && path.startsWith("/dashboard/candidate")) {
    return <Navigate to="/dashboard/company" replace />;
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
