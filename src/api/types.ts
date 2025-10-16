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
  id: number;
  poolId: number | null;
  poolName: string | null;
  roundNumber: number;
  matchNumber: number;
  teamAName: string;
  teamBName: string | null;
  scoreA: number | null;
  scoreB: number | null;
  status: 'pending' | 'completed';
  slotIndex: number | null;
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
