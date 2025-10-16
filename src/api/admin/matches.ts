import type { Match, GenerateMatchesDto, GenerateMatchesResponse } from '@/api/types';
import { client } from '@/api/client';

/**
 * Generate matches for a division based on pool configuration
 * Backend may return {data: {...}} or direct object
 */
export const generateMatches = (
  divisionId: string,
  data: GenerateMatchesDto
): Promise<GenerateMatchesResponse> => {
  return client
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
  return client.put(`/matches/${matchId}`, data).then((res) => {
    // Admin mutations typically return direct objects
    return res.data;
  });
};

/**
 * Delete a match
 */
export const deleteMatch = (matchId: string): Promise<void> => {
  return client.delete(`/matches/${matchId}`).then((res) => res.data);
};
