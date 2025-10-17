// Response envelope from backend
export interface ApiListResponse<T> {
  data: T[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

// Division types
export interface DivisionStats {
  teams: number;
  pools: number;
  matches: number;
  completedMatches: number;
}

export interface Division {
  id: number;
  name: string;
  createdAt: string;
  stats: DivisionStats;
}

export interface Pool {
  id: number;
  name: string;
  teamCount: number;
}

export interface DivisionDetail extends Division {
  pools: Pool[];
}

// Match types

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
 * Request payload for match generation
 */
export interface GenerateMatchesDto {
  format: 'ROUND_ROBIN' | 'SINGLE_ELIM' | 'DOUBLE_ELIM';
  courts?: number;
  startTime?: string;
  matchDuration?: number;
  breakDuration?: number;
}

/**
 * Response from match generation
 */
export interface GenerateMatchesResponse {
  matches: Match[];
  count: number;
}

// Standings types
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

export interface StandingsResponse {
  divisionId: number;
  divisionName: string;
  pools: PoolStandings[];
}

// Phase 6: Score Entry Types

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
