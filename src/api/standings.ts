import apiClient from './client';
import type { StandingsResponse } from './types';

export interface GetStandingsParams {
  poolId?: number;
}

export const getStandings = async (
  divisionId: number,
  params?: GetStandingsParams
) => {
  const { data } = await apiClient.get<StandingsResponse>(
    `/divisions/${divisionId}/standings`,
    { params }
  );
  return data;
};
