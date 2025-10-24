/**
 * Team Type Definitions
 * Defines all types related to tournament teams
 */

/**
 * Player as part of a team roster
 *
 * Migration note (2025-10-23): Updated to use single name field and separate ratings.
 */
export interface TeamPlayer {
  id: number;

  /** Full name (e.g., "John Smith") - NEW field */
  name: string;

  /** DUPR singles rating - NEW field */
  singlesRating: number | null;

  /** DUPR doubles rating - NEW field */
  doublesRating: number | null;

  /** Legacy rating field - kept for compatibility */
  duprRating: number | null;

  /** Position in team (1 or 2 for doubles) */
  position: number;

  // DEPRECATED - May exist in old responses
  /** @deprecated Use 'name' field instead */
  firstName?: string;
  /** @deprecated Use 'name' field instead */
  lastName?: string;
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
  name?: string; // Optional - auto-generated from player names if not provided
  playerIds?: number[]; // NEW: Array of 1-2 player IDs for manual team creation
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
