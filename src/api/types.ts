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
export interface Match {
  id: string;
  divisionId: string;
  poolId: string | null;
  poolName: string | null;
  roundNumber: number;
  matchNumber: number;
  teamAId: string;
  teamAName: string;
  teamBId: string | null; // Null for BYE matches
  teamBName: string | null;
  scoreA: number | null;
  scoreB: number | null;
  status: 'pending' | 'completed' | 'in_progress';
  slotIndex: number | null;
  courtLabel: string | null;
  scheduledAt: string | null;
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
