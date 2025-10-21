import type {
  Match,
  GenerateMatchesDto,
  GenerateMatchesResponse,
  UpdateMatchScoreRequest,
  UpdateMatchScoreResponse
} from '@/api/types';
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
 * Generate matches for a division based on pool configuration (Phase 2C)
 * @param tournamentId - Tournament ID
 * @param divisionId - Division ID
 * @param data - Match generation parameters
 * @returns Response with success, message, and summary
 */
export const generateMatches = (
  tournamentId: number,
  divisionId: number,
  data: GenerateMatchesDto
): Promise<GenerateMatchesResponse> => {
  return adminApiClient
    .post(`/admin/tournaments/${tournamentId}/divisions/${divisionId}/generate-matches`, data)
    .then((res) => {
      // Phase 2C returns {success, message, summary} format
      return res.data;
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

/**
 * Update match score (Phase 6)
 * @param matchId - Match ID
 * @param data - Score update data (scoreJson, status, winnerTeamId, notes)
 * @returns Response with success flag and updated match
 */
export const updateMatchScore = async (
  matchId: number,
  data: UpdateMatchScoreRequest
): Promise<UpdateMatchScoreResponse> => {
  const response = await adminApiClient.put<UpdateMatchScoreResponse>(
    `/matches/${matchId}/score`,
    data
  );
  return response.data;
};

/**
 * Get single match by ID (Phase 6)
 * @param matchId - Match ID
 * @returns Match object
 */
export const getMatch = async (matchId: number): Promise<Match> => {
  const response = await adminApiClient.get<{ data: Match }>(`/matches/${matchId}`);
  // Backend returns {data: {...}} so extract the match object
  return response.data.data;
};
