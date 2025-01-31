// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import ProtectedRoute from './guards/protectedRouteGuard';
import PublicRouteGuard from './guards/publicRouteGuard';
import RestrictedRouteGuard from './guards/user-role-guards/RestrictedRouteGuard';
import QueryParamsProvider from './providers/QueryParamsProvider';

/* ***Apps**** */
const UserProfile = Loadable(lazy(() => import('../views/apps/user-profile/UserProfile')));
const Users = Loadable(lazy(() => import('../views/apps/user-profile/Users')));
const AccountSetting = Loadable(lazy(() => import('../views/apps/account-setting/AccountSetting')));

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const ModernDash = Loadable(lazy(() => import('../views/dashboard/Modern')));
const Employee = Loadable(lazy(() => import('../views/dashboards/employee/Employee')));
const EmployeeDetail = Loadable(lazy(() => import('../views/dashboards/employee/EmployeeDetail')));
const Clients = Loadable(lazy(() => import('../views/dashboards/client/Clients')));
const ClientDetail = Loadable(lazy(() => import('../views/dashboards/client/ClientDetail')));
const StaffPage = Loadable(lazy(() => import('../views/dashboards/staff/Staff')));
const StaffDetail = Loadable(lazy(() => import('../views/dashboards/staff/StaffDetail')));
const Schedule = Loadable(lazy(() => import('../views/dashboards/schedule/Schedule')));
const StaffSchedule = Loadable(
  lazy(() => import('../views/dashboards/staff/schedule/StaffSchedule')),
);
const StaffScheduleEdit = Loadable(
  lazy(() => import('../views/dashboards/staff/schedule/StaffScheduleEdit')),
);
const StaffScheduleDetail = Loadable(
  lazy(() => import('../views/dashboards/staff/schedule/StaffScheduleDetail')),
);

// authentication
const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
const Register = Loadable(lazy(() => import('../views/authentication/auth1/Register')));
const EmailVerification = Loadable(
  lazy(() => import('../views/authentication/auth1/EmailVerification')),
);
const ForgotPassword = Loadable(lazy(() => import('../views/authentication/auth1/ForgotPassword')));
const TwoSteps = Loadable(lazy(() => import('../views/authentication/auth1/TwoSteps')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Maintenance = Loadable(lazy(() => import('../views/authentication/Maintenance')));

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboards/modern" /> },
      {
        path: '/dashboards/modern',
        exact: true,
        element: (
          <ProtectedRoute>
            <ModernDash />
          </ProtectedRoute>
        ),
      },
      {
        path: '/user-profile',
        exact: true,
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: '/account-setting',
        exact: true,
        element: (
          <ProtectedRoute>
            <AccountSetting />
          </ProtectedRoute>
        ),
      },
      {
        path: '/schedule',
        exact: true,
        element: (
          <ProtectedRoute>
            <RestrictedRouteGuard>
              <Schedule />
            </RestrictedRouteGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/staff',
        exact: true,
        element: (
          <ProtectedRoute>
            <RestrictedRouteGuard>
              <StaffPage />
            </RestrictedRouteGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/staff/:id/edit',
        exact: true,
        element: (
          <ProtectedRoute>
            <RestrictedRouteGuard>
              <StaffDetail />
            </RestrictedRouteGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/staff/:id/schedule',
        exact: true,
        element: (
          <ProtectedRoute>
            <RestrictedRouteGuard>
              <StaffSchedule />
            </RestrictedRouteGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/staff/:id/schedule/:scheduleId',
        exact: true,
        element: (
          <ProtectedRoute>
            <RestrictedRouteGuard>
              <StaffScheduleDetail />
            </RestrictedRouteGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/staff/:id/schedule/:scheduleId/edit',
        exact: true,
        element: (
          <ProtectedRoute>
            <RestrictedRouteGuard>
              <StaffScheduleEdit />
            </RestrictedRouteGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/employees',
        exact: true,
        element: (
          <ProtectedRoute>
            <RestrictedRouteGuard>
              <Employee />
            </RestrictedRouteGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/employees/:id/edit',
        exact: true,
        element: (
          <ProtectedRoute>
            <RestrictedRouteGuard>
              <EmployeeDetail />
            </RestrictedRouteGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/users',
        exact: true,
        element: (
          <ProtectedRoute>
            <RestrictedRouteGuard>
              <Users />
            </RestrictedRouteGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/clients',
        exact: true,
        element: (
          <QueryParamsProvider>
            <ProtectedRoute>
              <RestrictedRouteGuard>
                <Clients />
              </RestrictedRouteGuard>
            </ProtectedRoute>
          </QueryParamsProvider>
        ),
      },
      {
        path: '/clients/:id/edit',
        exact: true,
        element: (
          <ProtectedRoute>
            <RestrictedRouteGuard>
              <ClientDetail />
            </RestrictedRouteGuard>
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      {
        path: '/auth/404',
        element: (
          <PublicRouteGuard>
            <Error />
          </PublicRouteGuard>
        ),
      },
      {
        path: '/auth/login',
        element: (
          <PublicRouteGuard>
            <Login />
          </PublicRouteGuard>
        ),
      },
      {
        path: '/auth/register',
        element: (
          <PublicRouteGuard>
            <Register />
          </PublicRouteGuard>
        ),
      },
      { path: '/auth/verify', element: <EmailVerification /> },
      {
        path: '/auth/forgot-password',
        element: (
          <PublicRouteGuard>
            <ForgotPassword />
          </PublicRouteGuard>
        ),
      },
      {
        path: '/auth/two-steps',
        element: (
          <PublicRouteGuard>
            <TwoSteps />
          </PublicRouteGuard>
        ),
      },
      {
        path: '/auth/maintenance',
        element: (
          <PublicRouteGuard>
            <Maintenance />
          </PublicRouteGuard>
        ),
      },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

const router = createBrowserRouter(Router);
export default router;
