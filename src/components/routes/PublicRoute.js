import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicRoute({ children, ...rest }) {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return null;
  if (isAuthenticated) {
    // Redirect to dashboard based on user type
    if (user?.type === 'company') return <Navigate to="/dashboard/company" replace />;
    return <Navigate to="/dashboard/candidate" replace />;
  }
  return children ? children : <Outlet />;
} 