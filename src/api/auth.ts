import type { User } from '@/types/auth';
import { apiClient } from '@/api/client';

/**
 * Get the currently authenticated user
 * @returns User object if authenticated
 * @throws 401 error if not authenticated
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/auth/me');
  return response.data;
};

/**
 * Log out the current user
 * Clears the session cookie on the backend
 */
export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};

/**
 * Initiate Google OAuth login flow
 * This redirects the browser to the backend auth endpoint
 */
export const initiateGoogleLogin = (): void => {
  // Full URL to backend OAuth endpoint
  const authUrl = `${import.meta.env.VITE_API_BASE_URL.replace('/api/public', '')}/api/auth/google`;
  window.location.href = authUrl;
};
