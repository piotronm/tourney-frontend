import type { Pool, CreatePoolDto, UpdatePoolDto } from '@/types/pool';
import { apiClient } from '@/api/client';
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
 * Get all pools for a division
 * @param divisionId - Division ID
 * @returns Promise resolving to array of pools
 */
export const getPools = async (divisionId: number): Promise<Pool[]> => {
  const response = await apiClient.get<{ data: Pool[] }>(`/divisions/${divisionId}/pools`);
  // Backend returns {data: [...]} so extract the array
  return response.data.data || [];
};

/**
 * Create a new pool in a division
 * @param divisionId - Division ID
 * @param data - Pool creation data
 * @returns Promise resolving to created pool
 */
export const createPool = async (
  divisionId: number,
  data: CreatePoolDto
): Promise<Pool> => {
  const response = await adminApiClient.post<Pool>(
    `/divisions/${divisionId}/pools`,
    data
  );
  return response.data;
};

/**
 * Update an existing pool
 * @param poolId - Pool ID
 * @param data - Pool update data
 * @returns Promise resolving to updated pool
 */
export const updatePool = async (
  poolId: number,
  data: UpdatePoolDto
): Promise<Pool> => {
  const response = await adminApiClient.put<Pool>(`/pools/${poolId}`, data);
  return response.data;
};

/**
 * Delete a pool
 * @param poolId - Pool ID
 * @returns Promise resolving when deletion is complete
 */
export const deletePool = async (poolId: number): Promise<void> => {
  await adminApiClient.delete(`/pools/${poolId}`);
};

/**
 * Bulk create pools in a division
 * @param divisionId - Division ID
 * @param pools - Array of pool templates to create
 * @returns Promise resolving to created pools
 */
export const bulkCreatePools = async (
  divisionId: number,
  pools: CreatePoolDto[]
): Promise<{ message: string; pools: Pool[] }> => {
  const response = await adminApiClient.post<{ message: string; pools: Pool[] }>(
    `/divisions/${divisionId}/pools/bulk`,
    { pools }
  );
  return response.data;
};
