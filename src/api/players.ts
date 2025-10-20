/**
 * Admin API Client for Players
 * Handles authenticated player CRUD operations
 */

import axios from 'axios';
import type {
  Player,
  CreatePlayerInput,
  UpdatePlayerInput,
  PlayersListResponse,
} from '@/types/player';

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
 * Get all players with optional search, pagination, and sorting
 */
export const getPlayers = async (params?: {
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'rating' | 'date';
  sortOrder?: 'asc' | 'desc';
}): Promise<PlayersListResponse> => {
  const response = await adminApiClient.get<PlayersListResponse>('/players', { params });
  return response.data;
};

/**
 * Get single player by ID
 */
export const getPlayer = async (id: number): Promise<Player> => {
  const response = await adminApiClient.get<Player>(`/players/${id}`);
  return response.data;
};

/**
 * Create new player
 */
export const createPlayer = async (data: CreatePlayerInput): Promise<Player> => {
  const response = await adminApiClient.post<Player>('/players', data);
  return response.data;
};

/**
 * Update existing player
 */
export const updatePlayer = async (
  id: number,
  data: UpdatePlayerInput
): Promise<Player> => {
  const response = await adminApiClient.put<Player>(`/players/${id}`, data);
  return response.data;
};

/**
 * Delete player
 */
export const deletePlayer = async (id: number): Promise<void> => {
  await adminApiClient.delete(`/players/${id}`);
};

/**
 * Export all players to CSV
 */
export const exportPlayers = async (): Promise<Blob> => {
  const response = await adminApiClient.get('/players/export/csv', {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Bulk delete players
 */
export const deleteBulkPlayers = async (ids: number[]): Promise<{ deleted: number; failed: number }> => {
  const response = await adminApiClient.post<{ deleted: number; failed: number }>('/players/bulk-delete', { ids });
  return response.data;
};
