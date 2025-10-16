/**
 * Division Type Definitions
 * Defines all types related to tournament divisions
 */

import type { Pool } from '@/types/pool';

// Division object from backend
export interface Division {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  stats: DivisionStats;
  pools?: Pool[];
}

// Division statistics
export interface DivisionStats {
  teams: number;
  pools: number;
  matches: number;
  completedMatches: number;
}

// Create division DTO (sent to backend)
export interface CreateDivisionDto {
  name: string;
}

// Update division DTO (sent to backend)
export interface UpdateDivisionDto {
  name: string;
}

// Division list query parameters
export interface DivisionListParams {
  limit?: number;
  offset?: number;
  search?: string;
}

// Paginated response envelope
export interface PaginatedDivisions {
  data: Division[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

// Form data for division form
export interface DivisionFormData {
  name: string;
}
