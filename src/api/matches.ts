import apiClient from './client';
import type { ApiListResponse, Match } from './types';

export interface GetMatchesParams {
  limit?: number;
  offset?: number;
  poolId?: number;
  status?: 'pending' | 'completed';
}

export const getMatches = async (divisionId: number, params?: GetMatchesParams) => {
  const { data } = await apiClient.get<ApiListResponse<Match>>(
    `/divisions/${divisionId}/matches`,
    { params }
  );
  return data;
};
