import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectIsLoading } from '../../store/apps/auth/AuthSlice';
import { useSelector } from 'src/store/Store';
import Spinner from 'src/views/spinner/Spinner';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    window.sessionStorage.setItem('previousPath', location.pathname);
  }, [location]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
