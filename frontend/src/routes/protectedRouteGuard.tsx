import React from 'react';
import { Navigate } from 'react-router-dom';
import { selectIsAuthenticated, selectIsLoading } from '../store/apps/auth/AuthSlice';
import { useSelector } from 'src/store/Store';
import Spinner from 'src/views/spinner/Spinner';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (isLoading) {
    return <Spinner />; 
  }

  return <>{children}</>;
};

export default ProtectedRoute;
