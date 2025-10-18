/**
 * Divisions API client
 * Handles fetching division data from the backend
 *
 * UPDATED: Phase 3 - All endpoints now require tournamentId
 */

import apiClient from './client';
import type { ApiListResponse, Division, DivisionDetail } from './types';

export interface GetDivisionsParams {
  limit?: number;
  offset?: number;
  search?: string;
}

/**
 * Fetch all divisions for a tournament
 * @param tournamentId - Tournament ID
 * @param params - Optional query parameters (limit, offset, search)
 * @returns List of divisions with stats
 */
export const getDivisions = async (
  tournamentId: number,
  params?: GetDivisionsParams
) => {
  const { data } = await apiClient.get<ApiListResponse<Division>>(
    `/tournaments/${tournamentId}/divisions`,
    { params }
  );
  return data;
};

/**
 * Fetch a single division by ID
 * @param tournamentId - Tournament ID
 * @param divisionId - Division ID
 * @returns Division detail with pools
 */
export const getDivision = async (tournamentId: number, divisionId: number) => {
  const { data } = await apiClient.get<DivisionDetail>(
    `/tournaments/${tournamentId}/divisions/${divisionId}`
  );
  return data;
};
