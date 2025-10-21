// Response envelope from backend
export interface ApiListResponse<T> {
  data: T[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

// ============================================
// TOURNAMENT TYPES (NEW - Phase 3)
// ============================================

/**
 * Tournament status enum
 */
export type TournamentStatus = 'draft' | 'active' | 'completed' | 'archived';

/**
 * Tournament stats (summary)
 */
export interface TournamentStats {
  divisions: number;
  teams: number;
  matches: number;
}

/**
 * Tournament object (list view)
 */
export interface Tournament {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status: TournamentStatus;
  createdAt: string;
  updatedAt: string;
  stats: TournamentStats;
}

/**
 * Division summary within tournament detail
 */
export interface TournamentDivisionSummary {
  id: number;
  name: string;
  teamCount: number;
  poolCount: number;
}

/**
 * Tournament detail (full view with divisions)
 */
export interface TournamentDetail {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status: TournamentStatus;
  createdAt: string;
  updatedAt: string;
  stats: TournamentStats & {
    completedMatches: number;
  };
  divisions: TournamentDivisionSummary[];
}

// ============================================
// DIVISION TYPES (UPDATED - Phase 3)
// ============================================

export interface DivisionStats {
  teams: number;
  pools: number;
  matches: number;
  completedMatches: number;
}

/**
 * Division object (UPDATED: now includes tournamentId)
 */
export interface Division {
  id: number;
  tournamentId: number; // ← ADDED for Phase 3
  name: string;
  createdAt: string;
  stats: DivisionStats;
}

export interface Pool {
  id: number;
  name: string;
  teamCount: number;
}

/**
 * Division detail (UPDATED: now includes tournamentId)
 */
export interface DivisionDetail extends Division {
  tournamentId: number; // ← ADDED for Phase 3
  pools: Pool[];
}

// ============================================
// MATCH TYPES
// ============================================

/**
 * Match status enum
 */
export type MatchStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'walkover'
  | 'forfeit';

/**
 * Individual game score within a match
 */
export interface GameScore {
  teamA: number;
  teamB: number;
}

/**
 * Match score structure (supports multiple games)
 */
export interface MatchScore {
  games: GameScore[];
  notes?: string;
}

/**
 * Match object from backend
 */
export interface Match {
  id: number;
  divisionId: number;
  poolId: number | null;
  poolName: string | null;
  roundNumber: number;
  matchNumber: number;

  // Team info
  teamAId: number;
  teamAName: string;
  teamBId: number | null; // Null for BYE matches
  teamBName: string | null;

  // Scores (Phase 6: New JSON format + legacy fields)
  scoreJson: MatchScore | null;
  scoreA: number | null; // Legacy (deprecated)
  scoreB: number | null; // Legacy (deprecated)

  // Status
  status: MatchStatus;
  winnerTeamId: number | null;

  // Scheduling
  scheduledAt: string | null;
  courtNumber: number | null;
  slotIndex: number | null;
  courtLabel: string | null; // Computed field

  // Metadata
  createdAt: string;
  updatedAt: string;
}

/**
 * Request payload for match generation (Phase 2C)
 */
export interface GenerateMatchesDto {
  regenerate?: boolean;
  assignCourts?: boolean;
  courtCount?: number;
}

/**
 * Response from match generation (Phase 2C)
 */
export interface GenerateMatchesResponse {
  success: boolean;
  message: string;
  summary: {
    totalMatches: number;
    pools: number;
    teams: number;
    byeMatches: number;
    totalRounds: number;
    matchesPerPool: Record<number, number>;
  };
}

// ============================================
// STANDINGS TYPES (UPDATED - Phase 3)
// ============================================

export interface TeamStanding {
  rank: number;
  teamId: number;
  teamName: string;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDiff: number;
  matchesPlayed: number;
}

export interface PoolStandings {
  poolId: number;
  poolName: string;
  standings: TeamStanding[];
}

/**
 * Standings response (UPDATED: now includes tournamentId and tournamentName)
 */
export interface StandingsResponse {
  tournamentId: number; // ← ADDED for Phase 3
  tournamentName: string; // ← ADDED for Phase 3
  divisionId: number;
  divisionName: string;
  pools: PoolStandings[];
}

// ============================================
// SCORE ENTRY TYPES (Phase 6)
// ============================================

/**
 * Request payload for updating match score
 */
export interface UpdateMatchScoreRequest {
  scoreJson?: MatchScore;
  status?: MatchStatus;
  winnerTeamId?: number;
  notes?: string;
}

/**
 * Response from updating match score
 */
export interface UpdateMatchScoreResponse {
  success: boolean;
  match: Match;
}
