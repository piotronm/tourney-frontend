import type {
  Division,
  CreateDivisionDto,
  UpdateDivisionDto,
  PaginatedDivisions,
  DivisionListParams,
} from '@/types/division';
import { apiClient } from '@/api/client';

export const getDivisions = async (
  params?: DivisionListParams
): Promise<PaginatedDivisions> => {
  const response = await apiClient.get<PaginatedDivisions>('/divisions', {
    params,
  });
  return response.data;
};

export const getDivision = async (id: number): Promise<Division> => {
  const response = await apiClient.get<Division>(`/divisions/${id}`);
  return response.data;
};

export const createDivision = async (
  data: CreateDivisionDto
): Promise<Division> => {
  const response = await apiClient.post<Division>('/divisions', data);
  return response.data;
};

export const updateDivision = async (
  id: number,
  data: UpdateDivisionDto
): Promise<Division> => {
  const response = await apiClient.put<Division>(`/divisions/${id}`, data);
  return response.data;
};

export const deleteDivision = async (id: number): Promise<void> => {
  await apiClient.delete(`/divisions/${id}`);
};
