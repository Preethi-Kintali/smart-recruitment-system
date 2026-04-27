import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (user) {
    // If logged in, redirect to respective dashboard
    if (user.role === 'admin') return <Navigate to="/admin" />;
    if (user.role === 'recruiter') return <Navigate to="/recruiter" />;
    return <Navigate to="/jobs" />;
  }

  return children;
};

export default PublicRoute;
