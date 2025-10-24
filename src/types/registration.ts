export type PairingType = 'has_partner' | 'needs_partner' | 'solo';
export type RegistrationStatus = 'registered' | 'cancelled' | 'waitlist';

export interface PlayerSummary {
  id: number;
  firstName: string;
  lastName: string;
  email: string | null;
  duprRating: number | null;
}

export interface DivisionAssignment {
  divisionId: number;
  divisionName: string;
  assignedAt: string;
  teamId: number | null;
  teamName: string | null;
}

export interface Registration {
  registrationId: number;
  playerId: number;
  playerName: string;
  playerEmail: string | null;
  playerDuprId: string | null;
  playerDuprRating: number | null;
  status: RegistrationStatus;
  notes: string | null;
  registeredAt: string;
  divisions: DivisionAssignment[];
}

export interface RegistrationStats {
  total: number;
  totalDivisionAssignments: number;
}

export interface RegistrationsResponse {
  data: Registration[];
  meta: RegistrationStats;
}

export interface CreateRegistrationInput {
  playerId: number;
  divisionIds: number[];
  notes?: string;
}

export interface AddDivisionsInput {
  divisionIds: number[];
}
