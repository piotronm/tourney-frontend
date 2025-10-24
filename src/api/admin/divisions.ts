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
  // Use adminApiClient to get full stats including registeredPlayers
  const response = await adminApiClient.get<{
    divisions: Array<{
      id: number;
      tournament_id: number;
      name: string;
      format: string;
      format_config: any;
      created_at: string;
      updated_at: string;
      stats: {
        registeredPlayers: number;
        teams: number;
        pools: number;
        matches: number;
        completedMatches: number;
      };
    }>;
    total: number;
    limit: number;
    offset: number;
  }>(
    `/tournaments/${tournamentId}/divisions`,
    { params }
  );

  // Transform backend snake_case to frontend camelCase
  return {
    data: response.data.divisions.map(div => ({
      id: div.id,
      name: div.name,
      createdAt: div.created_at,
      updatedAt: div.updated_at,
      stats: div.stats,
    })),
    meta: {
      total: response.data.total,
      limit: response.data.limit,
      offset: response.data.offset
    }
  };
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
  // Use adminApiClient to get full stats including registeredPlayers
  const response = await adminApiClient.get<{
    id: number;
    tournament_id: number;
    name: string;
    format: string;
    format_config: any;
    created_at: string;
    updated_at: string;
    stats: {
      registeredPlayers: number;
      teams: number;
      pools: number;
      matches: number;
      completedMatches: number;
    };
  }>(
    `/tournaments/${tournamentId}/divisions/${divisionId}`
  );

  // Transform backend snake_case to frontend camelCase
  return {
    id: response.data.id,
    name: response.data.name,
    createdAt: response.data.created_at,
    updatedAt: response.data.updated_at,
    stats: response.data.stats,
  };
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
