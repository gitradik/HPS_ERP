import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom'; // Правильный импорт для React Router v6
import { useSelector, useDispatch } from 'react-redux';
import { refreshTokenSuccess, selectIsAuthenticated } from '../store/apps/auth/AuthSlice';
import { useRefreshTokenMutation } from '../services/api/auth.api'; // Импортируйте мутацию refreshToken

const PublicRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [refreshToken] = useRefreshTokenMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('refreshToken')
    if (!isAuthenticated && token) {
      refreshToken({ refreshToken: token })
        .unwrap() 
        .then((data: any) => {
          dispatch(refreshTokenSuccess(data.refreshToken));
        })
        .catch((err) => {
          console.error('Ошибка обновления токена:', err);
        })
    }
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRouteGuard;
