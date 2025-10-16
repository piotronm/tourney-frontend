import apiClient from './client';
import type { ApiListResponse, Division, DivisionDetail } from './types';

export interface GetDivisionsParams {
  limit?: number;
  offset?: number;
  search?: string;
}

export const getDivisions = async (params?: GetDivisionsParams) => {
  const { data } = await apiClient.get<ApiListResponse<Division>>('/divisions', {
    params,
  });
  return data;
};

export const getDivision = async (id: number) => {
  const { data } = await apiClient.get<DivisionDetail>(`/divisions/${id}`);
  return data;
};
