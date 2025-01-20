import { useSnackbar } from 'notistack';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { selectUserRole } from 'src/store/apps/auth/AuthSlice';
import { useSelector } from 'src/store/Store';
import { UserRole } from 'src/types/auth/auth';

const NonEmployeeClientStaffUserRouteGuard = ({ children }: { children: React.ReactNode }) => {
  console.log("NonEmployeeClientStaffUserRouteGuard START")
  const userRole = useSelector(selectUserRole);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  console.log(userRole)
  if (userRole && [
    UserRole.EMPLOYEE,
    UserRole.CLIENT,
    UserRole.STAFF,
    UserRole.USER
  ].includes(userRole)) {

    navigate(-1);
    enqueueSnackbar("Sie haben keine Berechtigung, auf diese Ressource zuzugreifen.", { variant: "error", autoHideDuration: 3000 });
    return;
  }

  console.log("NonEmployeeClientStaffUserRouteGuard END")
  return <>{children}</>;
};

export default NonEmployeeClientStaffUserRouteGuard;
