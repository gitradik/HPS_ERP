import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectUserRole } from 'src/store/auth/AuthSlice';
import { useSelector } from 'src/store/Store';
import { UserRole } from 'src/types/auth/auth';

const roles = [UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.STAFF, UserRole.USER];

const RestrictedRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const userRole = useSelector(selectUserRole);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (userRole && roles.includes(userRole)) {
      enqueueSnackbar('Sie haben keine Berechtigung, auf diese Ressource zuzugreifen.', {
        variant: 'error',
        autoHideDuration: 3000,
      });
      navigate(-1);
    }
  }, [userRole, navigate, enqueueSnackbar]);

  if (!userRole) return null;

  if (roles.includes(userRole)) return null;

  return <>{children}</>;
};

export default RestrictedRouteGuard;
