import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as registrationsApi from '@/api/registrations';
import type { ListRegistrationsParams } from '@/api/registrations';
import type { CreateRegistrationInput, AddDivisionsInput } from '@/types/registration';

export function useRegistrations(
  tournamentId: number,
  params?: ListRegistrationsParams
) {
  return useQuery({
    queryKey: ['tournaments', tournamentId, 'registrations', params],
    queryFn: () => registrationsApi.getRegistrations(tournamentId, params),
    enabled: !!tournamentId
  });
}

export function useCreateRegistration(tournamentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRegistrationInput) =>
      registrationsApi.createRegistration(tournamentId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['tournaments', tournamentId, 'registrations']
      });
      queryClient.invalidateQueries({
        queryKey: ['admin-teams', tournamentId]
      });

      const divCount = variables.divisionIds.length;
      toast.success(
        `Player registered in ${divCount} division${divCount > 1 ? 's' : ''} successfully!`
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed');
    }
  });
}

export function useAddPlayerToDivisions(tournamentId: number, playerId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddDivisionsInput) =>
      registrationsApi.addPlayerToDivisions(tournamentId, playerId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['tournaments', tournamentId, 'registrations']
      });
      toast.success(data.message || 'Divisions added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add divisions');
    }
  });
}

export function useRemovePlayerFromDivision(tournamentId: number, playerId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (divisionId: number) =>
      registrationsApi.removePlayerFromDivision(tournamentId, playerId, divisionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tournaments', tournamentId, 'registrations']
      });
      queryClient.invalidateQueries({
        queryKey: ['admin-teams', tournamentId]
      });
      toast.success('Division removed successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove division');
    }
  });
}

export function useDeleteRegistration(tournamentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (registrationId: number) =>
      registrationsApi.deleteRegistration(tournamentId, registrationId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['tournaments', tournamentId, 'registrations']
      });
      queryClient.invalidateQueries({
        queryKey: ['admin-teams', tournamentId]
      });
      toast.success(data?.message || 'Player unregistered successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Unregister failed');
    }
  });
}
