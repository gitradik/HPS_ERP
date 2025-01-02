// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import Loadable from '../layouts/full/shared/loadable/Loadable';

const UserProfile = Loadable(lazy(() => import('../views/apps/user-profile/UserProfile')));

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
// const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')))
const Error = Loadable(lazy(() => import('../views/authentication/Error')));

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/user-profile" /> },
      // { path: '/sample-page', exact: true, element: <SamplePage /> },
      { path: '/user-profile', exact: true, element: <UserProfile /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '', element: <Navigate to="/auth/404" /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
      { path: '404', element: <Error /> },
    ],
  },
];

const router = createBrowserRouter(Router);
export default router;
