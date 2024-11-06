import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const PatientVisitPage = lazy(() => import('src/pages/patient-visit'));
export const MedicarePage = lazy(() => import('src/pages/medicare'));
export const AppointmentPage = lazy(() => import('src/pages/appointment'));
export const GPSearchPage = lazy(() => import('src/pages/gp_search'));
export const PatientSearchPage = lazy(() => import('src/pages/patient_search'));
export const TimesheetPage = lazy(() => import('src/pages/timesheet'));
export const UpAppPage = lazy(() => import('src/pages/upapp'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const AppointmentDetailPage = lazy(() => import('src/pages/appointment-detail'));
// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'patient-visit', element: <PatientVisitPage /> },
        { path: 'medicare', element: <MedicarePage /> },
        { path: 'appointment', element: <AppointmentPage /> },
        { path: 'gp_search', element: <GPSearchPage /> },
        { path: 'patient_search', element: <PatientSearchPage /> },
        { path: 'timesheet', element: <TimesheetPage /> },
        { path: 'upapp', element: <UpAppPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: '/appointment-detail/:appointmentId', element: <AppointmentDetailPage />}
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
