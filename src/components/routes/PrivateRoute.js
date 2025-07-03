import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppMenu from "../ui/AppMenu";

export default function PrivateRoute({ children, ...rest }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children ? (
    children
  ) : (
    <>
      <AppMenu />
      <Outlet />
    </>
  );
}
