import type {
  Division,
  CreateDivisionDto,
  UpdateDivisionDto,
  PaginatedDivisions,
  DivisionListParams,
} from '@/types/division';
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

// Response interceptor for error handling
adminApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('Network error - please check your connection');
    } else {
      throw error;
    }
  }
);

/**
 * Get paginated list of divisions for a tournament
 * @param tournamentId - Tournament ID
 * @param params - Query parameters (limit, offset, search)
 * @returns Paginated list of divisions
 */
export const getDivisions = async (
  tournamentId: number,
  params?: DivisionListParams
): Promise<PaginatedDivisions> => {
  const response = await apiClient.get<PaginatedDivisions>(
    `/tournaments/${tournamentId}/divisions`,
    { params }
  );
  return response.data;
};

/**
 * Get single division by ID
 * @param tournamentId - Tournament ID
 * @param divisionId - Division ID
 * @returns Division object
 */
export const getDivision = async (
  tournamentId: number,
  divisionId: number
): Promise<Division> => {
  const response = await apiClient.get<Division>(
    `/tournaments/${tournamentId}/divisions/${divisionId}`
  );
  return response.data;
};

/**
 * Create new division in tournament
 * @param tournamentId - Tournament ID
 * @param data - Division creation data
 * @returns Created division
 */
export const createDivision = async (
  tournamentId: number,
  data: CreateDivisionDto
): Promise<Division> => {
  const response = await adminApiClient.post<Division>(
    `/tournaments/${tournamentId}/divisions`,
    data
  );
  return response.data;
};

/**
 * Update existing division
 * @param tournamentId - Tournament ID
 * @param divisionId - Division ID
 * @param data - Division update data
 * @returns Updated division
 */
export const updateDivision = async (
  tournamentId: number,
  divisionId: number,
  data: UpdateDivisionDto
): Promise<Division> => {
  const response = await adminApiClient.put<Division>(
    `/tournaments/${tournamentId}/divisions/${divisionId}`,
    data
  );
  return response.data;
};

/**
 * Delete division
 * @param tournamentId - Tournament ID
 * @param divisionId - Division ID
 */
export const deleteDivision = async (
  tournamentId: number,
  divisionId: number
): Promise<void> => {
  await adminApiClient.delete(`/tournaments/${tournamentId}/divisions/${divisionId}`);
};
