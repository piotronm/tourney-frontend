/**
 * Team Type Definitions
 * Defines all types related to tournament teams
 */

// Player information within a team
export interface TeamPlayer {
  id: number;
  firstName: string;
  lastName: string;
  duprRating: number | null;
  position: 1 | 2;
}

// Team source tracking (Day 1: Backend Foundation)
export type TeamSource = 'registration' | 'manual' | 'import';

// Team object from backend
export interface Team {
  id: number;
  divisionId: number;
  name: string;
  poolId: number | null;
  poolName: string | null;
  poolSeed: number | null;
  source?: TeamSource; // Day 1: Track how team was created
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  matchesPlayed: number;
  players?: TeamPlayer[]; // Day 1: Player roster
  createdAt: string;
  updatedAt: string;
}

// Create team DTO (sent to backend)
export interface CreateTeamDto {
  name: string;
  poolId?: number | null;
  poolSeed?: number | null;
}

// Update team DTO (sent to backend)
export interface UpdateTeamDto {
  name?: string;
  poolId?: number | null;
  poolSeed?: number | null;
}

// Team list query parameters
export interface TeamListParams {
  divisionId: number;
  limit?: number;
  offset?: number;
  search?: string;
  poolId?: number; // Filter by pool
}

// Paginated response envelope
export interface PaginatedTeams {
  data: Team[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

// Form data for team form
export interface TeamFormData {
  name: string;
  poolId: string; // MUI Select uses strings
  poolSeed: string; // TextField type="number" uses strings
}

// Bulk import types
export interface BulkImportTeam {
  name: string;
  poolName?: string;
  poolSeed?: number;
}

export interface BulkImportResult {
  created: number;
  createdPools?: string[];
  errors: Array<{
    row: number;
    message: string;
    team?: string;
  }>;
}

// CSV row type
export interface TeamCsvRow {
  name: string;
  pool?: string;
  seed?: string;
}
