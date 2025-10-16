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
  const response = await adminApiClient.post<Division>('/divisions', data);
  return response.data;
};

export const updateDivision = async (
  id: number,
  data: UpdateDivisionDto
): Promise<Division> => {
  const response = await adminApiClient.put<Division>(`/divisions/${id}`, data);
  return response.data;
};

export const deleteDivision = async (id: number): Promise<void> => {
  await adminApiClient.delete(`/divisions/${id}`);
};
