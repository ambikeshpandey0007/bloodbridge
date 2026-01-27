import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import PublicRegistrationPage from '@/components/pages/PublicRegistrationPage';
import PublicLoginPage from '@/components/pages/PublicLoginPage';
import PublicLoginOTPPage from '@/components/pages/PublicLoginOTPPage';
import HospitalRegistrationPage from '@/components/pages/HospitalRegistrationPage';
import PublicDashboardPage from '@/components/pages/PublicDashboardPage';
import HospitalDashboardPage from '@/components/pages/HospitalDashboardPage';
import BloodAvailabilityPage from '@/components/pages/BloodAvailabilityPage';
import SOSAlertPage from '@/components/pages/SOSAlertPage';
import SOSResponsesPage from '@/components/pages/SOSResponsesPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "public-registration",
        element: <PublicRegistrationPage />,
      },
      {
        path: "public-login",
        element: <PublicLoginPage />,
      },
      {
        path: "public-login-otp",
        element: <PublicLoginOTPPage />,
      },
      {
        path: "hospital-registration",
        element: <HospitalRegistrationPage />,
      },
      {
        path: "public-dashboard",
        element: <PublicDashboardPage />,
      },
      {
        path: "hospital-dashboard",
        element: <HospitalDashboardPage />,
      },
      {
        path: "blood-availability",
        element: <BloodAvailabilityPage />,
      },
      {
        path: "sos-alert",
        element: <SOSAlertPage />,
      },
      {
        path: "sos-responses/:alertId",
        element: <SOSResponsesPage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
