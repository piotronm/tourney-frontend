/**
 * Application Router Configuration
 *
 * UPDATED: Phase 3 - Tournament Hierarchy
 *
 * Public Routes:
 * - / → HomePage
 * - /tournaments → TournamentsPage (list all tournaments)
 * - /tournaments/:tournamentId → TournamentDetailPage (tournament info + divisions)
 * - /tournaments/:tournamentId/divisions → DivisionsPage (divisions in tournament)
 * - /tournaments/:tournamentId/divisions/:id → DivisionDetailPage
 *   - /tournaments/:tournamentId/divisions/:id/standings → StandingsPage (default)
 *   - /tournaments/:tournamentId/divisions/:id/matches → MatchesPage
 *
 * Admin Routes: (TODO: Will need tournament support in future phase)
 * - /admin/* → Admin dashboard and management
 */

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
import { DivisionHubPage } from '@/pages/admin/DivisionHubPage';
import { AllTeamsPage } from '@/pages/admin/AllTeamsPage';
import { AllPoolsPage } from '@/pages/admin/AllPoolsPage';
import { AllMatchesPage } from '@/pages/admin/AllMatchesPage';
import { SettingsPage } from '@/pages/admin/SettingsPage';

// NEW: Tournament pages (Phase 3)
import { TournamentsPage } from '@/pages/TournamentsPage';
import { TournamentDetailPage } from '@/pages/TournamentDetailPage';

export const router = createBrowserRouter([
  // ============================================
  // PUBLIC ROUTES
  // ============================================
  {
    path: '/',
    element: <Layout />,
    children: [
      // Home page
      {
        index: true,
        element: <HomePage />,
      },

      // ============================================
      // TOURNAMENT ROUTES (NEW - Phase 3)
      // ============================================

      // List all tournaments
      {
        path: 'tournaments',
        element: <TournamentsPage />,
      },

      // Single tournament detail (shows divisions)
      {
        path: 'tournaments/:tournamentId',
        element: <TournamentDetailPage />,
      },

      // ============================================
      // DIVISION ROUTES (UPDATED - Now nested under tournament)
      // ============================================

      // List divisions in a tournament
      {
        path: 'tournaments/:tournamentId/divisions',
        element: <DivisionsPage />,
      },

      // Single division detail with nested tabs
      {
        path: 'tournaments/:tournamentId/divisions/:id',
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

  // ============================================
  // AUTH ROUTES
  // ============================================

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

  // ============================================
  // ADMIN ROUTES (Protected)
  // TODO: Will need tournament support in future phase
  // ============================================
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
          // Global views (placeholder pages)
          {
            path: 'teams',
            element: <AllTeamsPage />,
          },
          {
            path: 'pools',
            element: <AllPoolsPage />,
          },
          {
            path: 'matches',
            element: <AllMatchesPage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
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
            path: 'divisions/:id',
            element: <DivisionHubPage />,
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

  // ============================================
  // 404 FALLBACK
  // ============================================
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
