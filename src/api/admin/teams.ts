import type {
  Team,
  CreateTeamDto,
  UpdateTeamDto,
  PaginatedTeams,
  TeamListParams,
  BulkImportTeam,
  BulkImportResult,
} from '@/types/team';
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
 * Admin API client for team operations
 * Read operations use public API, mutations use admin API with auth
 */

/**
 * Get paginated list of teams for a division
 * @param params - Query parameters (divisionId, limit, offset, search, poolId)
 * @returns Paginated list of teams
 */
export const getTeams = async (params: TeamListParams): Promise<PaginatedTeams> => {
  const { divisionId, ...queryParams } = params;
  const response = await apiClient.get<PaginatedTeams>(
    `/divisions/${divisionId}/teams`,
    { params: queryParams }
  );
  return response.data;
};

/**
 * Get single team by ID
 * @param divisionId - Division ID
 * @param teamId - Team ID
 * @returns Team object
 */
export const getTeam = async (divisionId: number, teamId: number): Promise<Team> => {
  const response = await apiClient.get<Team>(
    `/divisions/${divisionId}/teams/${teamId}`
  );
  return response.data;
};

/**
 * Create new team
 * @param divisionId - Division ID
 * @param data - Team creation data
 * @returns Created team
 */
export const createTeam = async (
  divisionId: number,
  data: CreateTeamDto
): Promise<Team> => {
  const response = await adminApiClient.post<Team>(
    `/divisions/${divisionId}/teams`,
    data
  );
  return response.data;
};

/**
 * Update existing team
 * @param divisionId - Division ID
 * @param teamId - Team ID
 * @param data - Team update data
 * @returns Updated team
 */
export const updateTeam = async (
  divisionId: number,
  teamId: number,
  data: UpdateTeamDto
): Promise<Team> => {
  const response = await adminApiClient.put<Team>(
    `/divisions/${divisionId}/teams/${teamId}`,
    data
  );
  return response.data;
};

/**
 * Delete team
 * @param divisionId - Division ID
 * @param teamId - Team ID
 */
export const deleteTeam = async (
  divisionId: number,
  teamId: number
): Promise<void> => {
  await adminApiClient.delete(`/divisions/${divisionId}/teams/${teamId}`);
};

/**
 * Bulk import teams from CSV
 * @param divisionId - Division ID
 * @param teams - Array of teams to import
 * @returns Import result with success/error counts
 */
export const bulkImportTeams = async (
  divisionId: number,
  teams: BulkImportTeam[]
): Promise<BulkImportResult> => {
  const response = await adminApiClient.post<BulkImportResult>(
    `/divisions/${divisionId}/teams/bulk`,
    { teams }
  );
  return response.data;
};
