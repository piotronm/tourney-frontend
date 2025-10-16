import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthContextType } from '@/types/auth';
import { getCurrentUser, logout as apiLogout, initiateGoogleLogin } from '@/api/auth';

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider - Wraps the app and provides authentication state
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check if user has an active session
   * Called on mount and can be called manually to refresh session
   */
  const checkSession = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getCurrentUser();
      setUser(userData);
    } catch {
      // User is not authenticated (401 error is expected)
      setUser(null);
      setError(null); // Don't show error for not being logged in
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initiate Google OAuth login
   * This will redirect to backend, then to Google, then back to frontend
   */
  const login = () => {
    initiateGoogleLogin();
  };

  /**
   * Log out the current user
   * Calls backend to clear session, then clears local state
   */
  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
      setError(null);
      // Redirect to home page after logout
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Failed to log out. Please try again.');
    }
  };

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Computed values
  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'ADMIN';
  const isViewer = user?.role === 'VIEWER';

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isViewer,
    checkSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth hook - Access authentication state and methods
 * @throws Error if used outside of AuthProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
