/**
 * Tournament API client
 * Handles fetching tournament data from the backend
 */

import apiClient from './client';
import type { ApiListResponse, Tournament, TournamentDetail } from './types';

/**
 * Fetch all active tournaments
 * @returns List of tournaments with stats
 */
export const getTournaments = async () => {
  const { data } = await apiClient.get<ApiListResponse<Tournament>>('/tournaments');
  return data;
};

/**
 * Fetch a single tournament by ID with full details
 * @param id - Tournament ID
 * @returns Tournament detail with divisions and extended stats
 */
export const getTournament = async (id: number) => {
  const { data } = await apiClient.get<TournamentDetail>(`/tournaments/${id}`);
  return data;
};
