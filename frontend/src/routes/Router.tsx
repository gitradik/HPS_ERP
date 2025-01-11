// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import ProtectedRoute from './protectedRouteGuard';
import PublicRouteGuard from './publicRouteGuard';

const UserProfile = Loadable(lazy(() => import('../views/apps/user-profile/UserProfile')));

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')))

// authentication
const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
const Login2 = Loadable(lazy(() => import('../views/authentication/auth2/Login2')));
const Register = Loadable(lazy(() => import('../views/authentication/auth1/Register')));
const Register2 = Loadable(lazy(() => import('../views/authentication/auth2/Register2')));
const ForgotPassword = Loadable(lazy(() => import('../views/authentication/auth1/ForgotPassword')));
const ForgotPassword2 = Loadable(
  lazy(() => import('../views/authentication/auth2/ForgotPassword2')),
);
const TwoSteps = Loadable(lazy(() => import('../views/authentication/auth1/TwoSteps')));
const TwoSteps2 = Loadable(lazy(() => import('../views/authentication/auth2/TwoSteps2')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Maintenance = Loadable(lazy(() => import('../views/authentication/Maintenance')));

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', exact: true, element: <ProtectedRoute><SamplePage /></ProtectedRoute> },
      { path: '/user-profile', exact: true, element: <ProtectedRoute><UserProfile /></ProtectedRoute> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/auth/404', element: <PublicRouteGuard><Error /></PublicRouteGuard> },
      { path: '/auth/login', element: <PublicRouteGuard><Login /></PublicRouteGuard> },
      { path: '/auth/login2', element: <PublicRouteGuard><Login2 /></PublicRouteGuard> },
      { path: '/auth/register', element: <PublicRouteGuard><Register /></PublicRouteGuard> },
      { path: '/auth/register2', element: <PublicRouteGuard><Register2 /></PublicRouteGuard> },
      { path: '/auth/forgot-password', element: <PublicRouteGuard><ForgotPassword /></PublicRouteGuard> },
      { path: '/auth/forgot-password2', element: <PublicRouteGuard><ForgotPassword2 /></PublicRouteGuard> },
      { path: '/auth/two-steps', element: <PublicRouteGuard><TwoSteps /></PublicRouteGuard> },
      { path: '/auth/two-steps2', element: <PublicRouteGuard><TwoSteps2 /></PublicRouteGuard> },
      { path: '/auth/maintenance', element: <PublicRouteGuard><Maintenance /></PublicRouteGuard> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

const router = createBrowserRouter(Router);
export default router;
