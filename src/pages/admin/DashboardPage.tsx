import { Navigate } from 'react-router-dom';

/**
 * Admin Dashboard Page
 * UPDATED: Phase 4B - Tournament Hierarchy
 *
 * Dashboard now redirects to AdminTournamentsPage (/admin/tournaments)
 * since all admin operations are now tournament-scoped.
 *
 * Router already handles /admin and /admin/dashboard redirects,
 * but this component provides consistent behavior if accessed directly.
 */
export const DashboardPage = () => {
  return <Navigate to="/admin/tournaments" replace />;
};
