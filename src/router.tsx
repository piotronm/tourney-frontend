import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { DivisionsPage } from './pages/DivisionsPage';
import { DivisionDetailPage } from './pages/DivisionDetailPage';
import { StandingsPage } from './pages/StandingsPage';
import { MatchesPage } from './pages/MatchesPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoginPage } from '@/pages/LoginPage';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DashboardPage } from '@/pages/admin/DashboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'divisions',
        element: <DivisionsPage />,
      },
      {
        path: 'divisions/:id',
        element: <DivisionDetailPage />,
        children: [
          {
            index: true,
            element: <Navigate to="standings" replace />,
          },
          {
            path: 'standings',
            element: <StandingsPage />,
          },
          {
            path: 'matches',
            element: <MatchesPage />,
          },
        ],
      },
    ],
  },
  // Login page (public)
  {
    path: '/login',
    element: <LoginPage />,
  },
  // Unauthorized page (public)
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  // Protected admin routes
  {
    element: <ProtectedRoute requireAdmin={true} />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          // More admin routes will be added in future phases
        ],
      },
    ],
  },
  // 404 fallback
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
