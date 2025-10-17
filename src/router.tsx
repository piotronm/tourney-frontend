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
import { AdminDivisionsPage } from '@/pages/admin/AdminDivisionsPage';
import { CreateDivisionPage } from '@/pages/admin/CreateDivisionPage';
import { EditDivisionPage } from '@/pages/admin/EditDivisionPage';
import { DivisionTeamsPage } from '@/pages/admin/DivisionTeamsPage';
import { AddTeamPage } from '@/pages/admin/AddTeamPage';
import { EditTeamPage } from '@/pages/admin/EditTeamPage';
import { DivisionPoolsPage } from '@/pages/admin/DivisionPoolsPage';
import { DivisionMatchesPage } from '@/pages/admin/DivisionMatchesPage';

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
          // Division management routes
          {
            path: 'divisions',
            element: <AdminDivisionsPage />,
          },
          {
            path: 'divisions/new',
            element: <CreateDivisionPage />,
          },
          {
            path: 'divisions/:id/edit',
            element: <EditDivisionPage />,
          },
          // Team management routes
          {
            path: 'divisions/:divisionId/teams',
            element: <DivisionTeamsPage />,
          },
          {
            path: 'divisions/:divisionId/teams/new',
            element: <AddTeamPage />,
          },
          {
            path: 'divisions/:divisionId/teams/:teamId/edit',
            element: <EditTeamPage />,
          },
          // Pool management routes
          {
            path: 'divisions/:id/pools',
            element: <DivisionPoolsPage />,
          },
          // Match management routes
          {
            path: 'divisions/:id/matches',
            element: <DivisionMatchesPage />,
          },
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
