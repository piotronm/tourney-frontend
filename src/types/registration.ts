export type PairingType = 'has_partner' | 'needs_partner' | 'solo';
export type RegistrationStatus = 'registered' | 'cancelled' | 'waitlist';

export interface PlayerSummary {
  id: number;
  firstName: string;
  lastName: string;
  email: string | null;
  duprRating: number | null;
}

export interface Registration {
  id: number;
  tournamentId: number;
  divisionId: number;
  divisionName: string | null;
  player: PlayerSummary;
  partner: PlayerSummary | null;
  pairingType: PairingType;
  status: RegistrationStatus;
  notes: string | null;
  registeredAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationStats {
  total: number;
  byDivision: Record<string, number>;
  byPairingType: {
    has_partner: number;
    needs_partner: number;
    solo: number;
  };
}

export interface RegistrationsResponse {
  data: Registration[];
  meta: RegistrationStats;
}

export interface CreateRegistrationInput {
  playerId: number;
  divisionId: number;
  partnerId?: number;
  pairingType: PairingType;
  notes?: string;
}
