import type {
  Registration,
  RegistrationsResponse,
  CreateRegistrationInput
} from '@/types/registration';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

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
