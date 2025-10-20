import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as registrationsApi from '@/api/registrations';
import type { ListRegistrationsParams } from '@/api/registrations';
import type { CreateRegistrationInput } from '@/types/registration';

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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tournaments', tournamentId, 'registrations']
      });
      toast.success('Player registered successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed');
    }
  });
}

export function useDeleteRegistration(tournamentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (registrationId: number) =>
      registrationsApi.deleteRegistration(tournamentId, registrationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tournaments', tournamentId, 'registrations']
      });
      toast.success('Player unregistered successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Unregister failed');
    }
  });
}
