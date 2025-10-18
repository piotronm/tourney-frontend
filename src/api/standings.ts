/**
 * Standings API client
 * Handles fetching standings data from the backend
 *
 * UPDATED: Phase 3 - All endpoints now require tournamentId
 */

import apiClient from './client';
import type { StandingsResponse } from './types';

export interface GetStandingsParams {
  poolId?: number;
}

/**
 * Fetch standings for a division
 * @param tournamentId - Tournament ID
 * @param divisionId - Division ID
 * @param params - Optional query parameters (poolId to filter by specific pool)
 * @returns Standings with pool rankings and team stats
 */
export const getStandings = async (
  tournamentId: number,
  divisionId: number,
  params?: GetStandingsParams
) => {
  const { data } = await apiClient.get<StandingsResponse>(
    `/tournaments/${tournamentId}/divisions/${divisionId}/standings`,
    { params }
  );
  return data;
};
