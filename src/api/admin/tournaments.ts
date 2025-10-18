/**
 * Admin API Client for Tournaments
 * Handles authenticated tournament CRUD operations
 */

import axios from 'axios';
import type { Tournament, TournamentDetail, TournamentStatus } from '@/api/types';

// Admin API client for authenticated mutations (POST/PUT/DELETE)
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
 * Tournament DTOs
 */
export interface CreateTournamentDto {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: TournamentStatus;
}

export interface UpdateTournamentDto {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: TournamentStatus;
}

export interface TournamentsListResponse {
  tournaments: Tournament[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Get all tournaments (admin view)
 */
export const getTournaments = async (): Promise<TournamentsListResponse> => {
  const response = await adminApiClient.get<TournamentsListResponse>('/tournaments');
  return response.data;
};

/**
 * Get single tournament by ID (admin view)
 */
export const getTournament = async (id: number): Promise<TournamentDetail> => {
  const response = await adminApiClient.get<TournamentDetail>(`/tournaments/${id}`);
  return response.data;
};

/**
 * Create new tournament
 */
export const createTournament = async (
  data: CreateTournamentDto
): Promise<Tournament> => {
  const response = await adminApiClient.post<Tournament>('/tournaments', data);
  return response.data;
};

/**
 * Update existing tournament
 */
export const updateTournament = async (
  id: number,
  data: UpdateTournamentDto
): Promise<Tournament> => {
  const response = await adminApiClient.put<Tournament>(`/tournaments/${id}`, data);
  return response.data;
};

/**
 * Delete tournament
 */
export const deleteTournament = async (id: number): Promise<void> => {
  await adminApiClient.delete(`/tournaments/${id}`);
};
