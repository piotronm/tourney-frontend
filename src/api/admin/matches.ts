import type { Match, GenerateMatchesDto, GenerateMatchesResponse } from '@/api/types';
import axios from 'axios';

// Admin API client for authenticated mutations (POST/PUT/DELETE)
// Uses /api instead of /api/public
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/public';
const adminApiClient = axios.create({
  baseURL: API_BASE_URL.replace('/api/public', '/api'),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * Generate matches for a division based on pool configuration
 * Backend may return {data: {...}} or direct object
 */
export const generateMatches = (
  divisionId: string,
  data: GenerateMatchesDto
): Promise<GenerateMatchesResponse> => {
  return adminApiClient
    .post(`/divisions/${divisionId}/generate-matches`, data)
    .then((res) => {
      // Handle response envelope pattern (learned from pools/teams fixes)
      // Backend might return {data: {matches, count}} or {matches, count}
      if (res.data.data) {
        return res.data.data; // Unwrap envelope
      }
      return res.data; // Direct object
    });
};

/**
 * Update a specific match
 */
export const updateMatch = (
  matchId: string,
  data: Partial<Match>
): Promise<Match> => {
  return adminApiClient.put(`/matches/${matchId}`, data).then((res) => {
    // Admin mutations typically return direct objects
    return res.data;
  });
};

/**
 * Delete a match
 */
export const deleteMatch = (matchId: string): Promise<void> => {
  return adminApiClient.delete(`/matches/${matchId}`).then((res) => res.data);
};
