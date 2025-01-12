import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { refreshTokenFailure, refreshTokenRequest, refreshTokenSuccess, selectIsAuthenticated } from '../store/apps/auth/AuthSlice';
import { useRefreshTokenMutation } from '../services/api/auth.api'; 
import Spinner from 'src/views/spinner/Spinner';

const PublicRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [refreshToken, { isLoading }] = useRefreshTokenMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshTokenRequest())
    const token = localStorage.getItem('refreshToken')
    if (!isAuthenticated && token) {
      refreshToken({ refreshToken: token })
        .unwrap() 
        .then((data: any) => dispatch(refreshTokenSuccess(data.refreshToken)))
        .catch((err) => dispatch(refreshTokenFailure(err.message)))
    }
  }, []);

  if (isLoading) {
    return <Spinner />
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRouteGuard;

