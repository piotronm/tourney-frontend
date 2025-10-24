import type {
  Registration,
  RegistrationsResponse,
  CreateRegistrationInput,
  AddDivisionsInput
} from '@/types/registration';

// Admin API endpoint - registrations require authentication
// Replace /api/public with /api for admin endpoints
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/public';
const API_BASE = API_BASE_URL.replace('/api/public', '/api');

export interface ListRegistrationsParams {
  divisionId?: number;
  pairingType?: string;
  status?: string;
}

export async function getRegistrations(
  tournamentId: number,
  params?: ListRegistrationsParams
): Promise<RegistrationsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.divisionId) searchParams.append('divisionId', params.divisionId.toString());
  if (params?.pairingType) searchParams.append('pairingType', params.pairingType);
  if (params?.status) searchParams.append('status', params.status);

  const url = `${API_BASE}/tournaments/${tournamentId}/registrations${
    searchParams.toString() ? '?' + searchParams.toString() : ''
  }`;

  const response = await fetch(url, {
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch registrations' }));
    throw new Error(error.message);
  }

  return response.json();
}

export async function createRegistration(
  tournamentId: number,
  data: CreateRegistrationInput
): Promise<Registration> {
  const response = await fetch(`${API_BASE}/tournaments/${tournamentId}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create registration' }));
    throw new Error(error.message);
  }

  return response.json();
}

export async function deleteRegistration(
  tournamentId: number,
  registrationId: number
): Promise<void> {
  const response = await fetch(
    `${API_BASE}/tournaments/${tournamentId}/registrations/${registrationId}`,
    {
      method: 'DELETE',
      credentials: 'include'
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to delete registration' }));
    throw new Error(error.message);
  }
}

export interface GenerateTeamsResponse {
  success: boolean;
  created: number;
  skipped: number;
  eligible: number;
  message: string;
  teams: Array<{
    id: number;
    name: string;
    players: Array<{
      id: number;
      firstName: string;
      lastName: string;
      duprRating: number | null;
    }>;
  }>;
}

export async function addPlayerToDivisions(
  tournamentId: number,
  playerId: number,
  data: AddDivisionsInput
): Promise<{ success: boolean; message: string; divisionsAdded: number }> {
  const response = await fetch(
    `${API_BASE}/tournaments/${tournamentId}/players/${playerId}/divisions`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to add divisions' }));
    throw new Error(error.message);
  }

  return response.json();
}

export async function removePlayerFromDivision(
  tournamentId: number,
  playerId: number,
  divisionId: number
): Promise<void> {
  const response = await fetch(
    `${API_BASE}/tournaments/${tournamentId}/players/${playerId}/divisions/${divisionId}`,
    {
      method: 'DELETE',
      credentials: 'include'
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to remove division' }));
    throw new Error(error.message);
  }
}

export async function generateTeamsFromRegistrations(
  tournamentId: number,
  divisionId: number
): Promise<GenerateTeamsResponse> {
  const response = await fetch(
    `${API_BASE}/tournaments/${tournamentId}/divisions/${divisionId}/generate-teams`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to generate teams' }));
    throw new Error(error.message || 'Failed to generate teams');
  }

  return response.json();
}
