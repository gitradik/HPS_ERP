import React from 'react';
import { Navigate } from 'react-router-dom'; // Используем правильный импорт для React Router v6
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/apps/auth/AuthSlice';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
