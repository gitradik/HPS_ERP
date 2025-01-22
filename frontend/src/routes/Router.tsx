// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import ProtectedRoute from './guards/protectedRouteGuard';
import PublicRouteGuard from './guards/publicRouteGuard';
import NonEmployeeClientStaffUserRouteGuard from './guards/user-role-guards/NonEmployeeClientStaffUserRouteGuard';
import ClientDetail from 'src/views/client/ClientDetail';

/* ***Apps**** */
const UserProfile = Loadable(
  lazy(() => import('../views/apps/user-profile/UserProfile')),
);
const UserProfileUsers = Loadable(
  lazy(() => import('../views/apps/user-profile/UserProfileUsers')),
);
const AccountSetting = Loadable(lazy(() => import('../views/apps/account-setting/AccountSetting')));
const Employee = Loadable(lazy(() => import('../views/employee/Employee')));
const EmployeeDetail = Loadable(lazy(() => import('../views/employee/EmployeeDetail')));
const Clients = Loadable(lazy(() => import('../views/client/Clients')));

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const ModernDash = Loadable(lazy(() => import('../views/dashboard/Modern')));

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
        path: '/employees',
        exact: true,
        element: (
          <ProtectedRoute>
            <NonEmployeeClientStaffUserRouteGuard>
              <Employee />
            </NonEmployeeClientStaffUserRouteGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/employees/:id',
        exact: true,
        element: (
          <ProtectedRoute>
            <NonEmployeeClientStaffUserRouteGuard>
              <EmployeeDetail />
            </NonEmployeeClientStaffUserRouteGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/users',
        exact: true,
        element: (
          <ProtectedRoute>
            <NonEmployeeClientStaffUserRouteGuard>
              <UserProfileUsers />
            </NonEmployeeClientStaffUserRouteGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/clients',
        exact: true,
        element: (
          <ProtectedRoute>
            <NonEmployeeClientStaffUserRouteGuard>
              <Clients />
            </NonEmployeeClientStaffUserRouteGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/clients/:id',
        exact: true,
        element: (
          <ProtectedRoute>
            <NonEmployeeClientStaffUserRouteGuard>
              <ClientDetail />
            </NonEmployeeClientStaffUserRouteGuard>
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
