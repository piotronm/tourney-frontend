import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  requireAdmin?: boolean;  // If true, only admins can access
}

/**
 * ProtectedRoute - Wraps routes that require authentication
 * Shows loading spinner while checking session
 * Redirects to /login if not authenticated
 * Redirects to /unauthorized if not admin (when requireAdmin=true)
 */
export const ProtectedRoute = ({ requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Requires admin but user is not admin - show unauthorized
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated (and admin if required) - render children
  return <Outlet />;
};
