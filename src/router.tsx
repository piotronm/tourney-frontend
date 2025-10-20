/**
 * Application Router Configuration
 *
 * UPDATED: Phase 1C-Part 1 - Admin Dashboard Landing Page
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
 * Admin Routes (UPDATED - Phase 1C-Part 2):
 * - /admin → DashboardPage (landing page with tiles)
 * - /admin/players → PlayersListPage (list)
 * - /admin/players/add → AddPlayerPage
 * - /admin/players/:id/edit → EditPlayerPage
 * - /admin/tournaments → AdminTournamentsPage (list)
 * - /admin/tournaments/new → CreateTournamentPage
 * - /admin/tournaments/:tournamentId → TournamentAdminHubPage
 * - /admin/tournaments/:tournamentId/edit → EditTournamentPage
 * - /admin/tournaments/:tournamentId/divisions → AdminDivisionsPage
 * - /admin/tournaments/:tournamentId/divisions/:id/* → Division management
 * - All admin routes now tournament-scoped
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
// Admin pages
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { SettingsPage } from '@/pages/admin/SettingsPage';

// Tournament admin pages (NEW - Phase 4B)
import { AdminTournamentsPage } from '@/pages/admin/AdminTournamentsPage';
import { CreateTournamentPage } from '@/pages/admin/CreateTournamentPage';
import { EditTournamentPage } from '@/pages/admin/EditTournamentPage';
import { TournamentAdminHubPage } from '@/pages/admin/TournamentAdminHubPage';
import { TournamentRegistrationsPage } from '@/pages/admin/TournamentRegistrationsPage';

// Division admin pages
import { AdminDivisionsPage } from '@/pages/admin/AdminDivisionsPage';
import { CreateDivisionPage } from '@/pages/admin/CreateDivisionPage';
import { EditDivisionPage } from '@/pages/admin/EditDivisionPage';
import { DivisionHubPage } from '@/pages/admin/DivisionHubPage';

// Player admin pages (NEW - Phase 1C-Part 2)
import { PlayersListPage } from '@/pages/admin/PlayersListPage';
import { AddPlayerPage } from '@/pages/admin/AddPlayerPage';
import { EditPlayerPage } from '@/pages/admin/EditPlayerPage';

// Team admin pages
import { DivisionTeamsPage } from '@/pages/admin/DivisionTeamsPage';
import { AddTeamPage } from '@/pages/admin/AddTeamPage';
import { EditTeamPage } from '@/pages/admin/EditTeamPage';

// Pool & Match admin pages
import { DivisionPoolsPage } from '@/pages/admin/DivisionPoolsPage';
import { DivisionMatchesPage } from '@/pages/admin/DivisionMatchesPage';

// Global admin pages (deprecated, kept for transition)
import { AllTeamsPage } from '@/pages/admin/AllTeamsPage';
import { AllPoolsPage } from '@/pages/admin/AllPoolsPage';
import { AllMatchesPage } from '@/pages/admin/AllMatchesPage';

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
  // UPDATED: Phase 4B - Tournament Hierarchy
  // ============================================
  {
    element: <ProtectedRoute requireAdmin={true} />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          // Show dashboard landing page at /admin
          {
            index: true,
            element: <DashboardPage />,
          },
          // Redirect old /admin/dashboard to new /admin
          {
            path: 'dashboard',
            element: <Navigate to="/admin" replace />,
          },

          // ============================================
          // PLAYER ADMIN ROUTES (NEW - Phase 1C-Part 2)
          // ============================================

          // List all players
          {
            path: 'players',
            element: <PlayersListPage />,
          },

          // Add new player
          {
            path: 'players/add',
            element: <AddPlayerPage />,
          },

          // Edit player
          {
            path: 'players/:id/edit',
            element: <EditPlayerPage />,
          },

          // ============================================
          // TOURNAMENT ADMIN ROUTES (NEW - Phase 4B)
          // ============================================

          // List all tournaments
          {
            path: 'tournaments',
            element: <AdminTournamentsPage />,
          },

          // Create new tournament
          {
            path: 'tournaments/new',
            element: <CreateTournamentPage />,
          },

          // Tournament admin hub
          {
            path: 'tournaments/:tournamentId',
            element: <TournamentAdminHubPage />,
          },

          // Edit tournament
          {
            path: 'tournaments/:tournamentId/edit',
            element: <EditTournamentPage />,
          },

          // Tournament registrations (Phase 2B)
          {
            path: 'tournaments/:tournamentId/registrations',
            element: <TournamentRegistrationsPage />,
          },

          // ============================================
          // DIVISION ADMIN ROUTES (UPDATED - Tournament-scoped)
          // ============================================

          // List divisions in tournament
          {
            path: 'tournaments/:tournamentId/divisions',
            element: <AdminDivisionsPage />,
          },

          // Create new division in tournament
          {
            path: 'tournaments/:tournamentId/divisions/new',
            element: <CreateDivisionPage />,
          },

          // Division admin hub
          {
            path: 'tournaments/:tournamentId/divisions/:id',
            element: <DivisionHubPage />,
          },

          // Edit division
          {
            path: 'tournaments/:tournamentId/divisions/:id/edit',
            element: <EditDivisionPage />,
          },

          // ============================================
          // TEAM ADMIN ROUTES (UPDATED - Tournament-scoped)
          // ============================================

          // Manage teams in division
          {
            path: 'tournaments/:tournamentId/divisions/:id/teams',
            element: <DivisionTeamsPage />,
          },

          // Add new team to division
          {
            path: 'tournaments/:tournamentId/divisions/:id/teams/new',
            element: <AddTeamPage />,
          },

          // Edit team
          {
            path: 'tournaments/:tournamentId/divisions/:id/teams/:teamId/edit',
            element: <EditTeamPage />,
          },

          // ============================================
          // POOL ADMIN ROUTES (UPDATED - Tournament-scoped)
          // ============================================

          // Manage pools in division
          {
            path: 'tournaments/:tournamentId/divisions/:id/pools',
            element: <DivisionPoolsPage />,
          },

          // ============================================
          // MATCH ADMIN ROUTES (UPDATED - Tournament-scoped)
          // ============================================

          // Manage matches in division
          {
            path: 'tournaments/:tournamentId/divisions/:id/matches',
            element: <DivisionMatchesPage />,
          },

          // ============================================
          // GLOBAL ADMIN PAGES (Deprecated - kept for transition)
          // ============================================

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

          // ============================================
          // SETTINGS
          // ============================================

          {
            path: 'settings',
            element: <SettingsPage />,
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
