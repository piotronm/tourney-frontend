import type { User, UserRole } from '@/types/auth';
import axios from 'axios';

/**
 * Create a separate axios client for auth endpoints
 * Auth endpoints are at /api/auth/*, NOT /api/public/auth/*
 *
 * This client:
 * - Uses /api instead of /api/public as base
 * - Includes credentials for session cookies
 * - Has same timeout and headers as main client
 */
const authClient = axios.create({
  // Remove /api/public and replace with /api
  baseURL: import.meta.env.VITE_API_BASE_URL.replace('/api/public', '/api'),
  timeout: 30000,
  withCredentials: true, // Required for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get the currently authenticated user
 * Calls: GET /api/auth/me
 *
 * Backend returns: { user: { id, email, name, picture, role } }
 * We extract the user object and normalize the role to uppercase
 *
 * @returns User object if authenticated
 * @throws 401 error if not authenticated
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await authClient.get<{ user: User }>('/auth/me');

  // Extract user from wrapped response
  const user = response.data.user;

  // Normalize role to uppercase to match TypeScript type
  return {
    ...user,
    role: user.role.toUpperCase() as UserRole,
  };
};

/**
 * Log out the current user
 * Calls: POST /api/auth/logout
 * Clears the session cookie on the backend
 */
export const logout = async (): Promise<void> => {
  await authClient.post('/auth/logout');
};

/**
 * Initiate Google OAuth login flow
 * Redirects browser to: GET /api/auth/google
 *
 * This redirects the browser to the backend auth endpoint,
 * which then redirects to Google's OAuth consent screen
 */
export const initiateGoogleLogin = (): void => {
  // VITE_API_BASE_URL is https://api.bracketiq.win/api/public
  // We need https://api.bracketiq.win/api/auth/google
  const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api/public', '');
  const authUrl = `${baseUrl}/api/auth/google`;

  console.log('Redirecting to OAuth URL:', authUrl);
  window.location.href = authUrl;
};
