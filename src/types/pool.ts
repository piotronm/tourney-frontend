/**
 * Pool Type Definitions
 * Defines all types related to tournament pools
 */

import type { Team } from './team';

// Pool object from backend
export interface Pool {
  id: number;
  divisionId: number;
  name: string;
  label: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  teams?: Team[];
}

// Create pool DTO (sent to backend)
export interface CreatePoolDto {
  name: string;
  label: string;
  orderIndex: number;
}

// Update pool DTO (sent to backend)
export interface UpdatePoolDto {
  name?: string;
  label?: string;
  orderIndex?: number;
}
