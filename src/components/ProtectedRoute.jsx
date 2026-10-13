import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-campus-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !user?.roles?.includes(requiredRole)) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-2xl shadow-sm border border-slate-200 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
        <p className="text-sm text-slate-600 mb-6">
          You need elevated administrative credentials to access this management area.
        </p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return children;
};
