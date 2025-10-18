/**
 * Matches API client
 * Handles fetching match data from the backend
 *
 * UPDATED: Phase 3 - All endpoints now require tournamentId
 */

import apiClient from './client';
import type { ApiListResponse, Match } from './types';

export interface GetMatchesParams {
  limit?: number;
  offset?: number;
  poolId?: number;
  status?: 'pending' | 'completed';
}

/**
 * Fetch matches for a division
 * @param tournamentId - Tournament ID
 * @param divisionId - Division ID
 * @param params - Optional query parameters (limit, offset, poolId, status)
 * @returns List of matches with team details
 */
export const getMatches = async (
  tournamentId: number,
  divisionId: number,
  params?: GetMatchesParams
) => {
  const { data } = await apiClient.get<ApiListResponse<Match>>(
    `/tournaments/${tournamentId}/divisions/${divisionId}/matches`,
    { params }
  );
  return data;
};
