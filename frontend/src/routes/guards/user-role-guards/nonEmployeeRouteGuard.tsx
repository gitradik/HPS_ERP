import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectUserRole } from 'src/store/apps/auth/AuthSlice';
import { useSelector } from 'src/store/Store';
import { UserRole } from 'src/types/auth/auth';

const NonEmployeeRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const userRole = useSelector(selectUserRole);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (userRole && [UserRole.EMPLOYEE, UserRole.USER].includes(userRole)) {
      navigate(-1);
      enqueueSnackbar("Sie haben keine Berechtigung, auf diese Ressource zuzugreifen.", { variant: "error", autoHideDuration: 3000 });
    }
  }, [userRole]);

  return <>{children}</>;
};

export default NonEmployeeRouteGuard;
