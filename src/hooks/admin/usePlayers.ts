/**
 * usePlayers Hooks
 * TanStack Query hooks for player data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getPlayers,
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer,
  deleteAllPlayers,
} from '@/api/players';
import type { CreatePlayerInput, UpdatePlayerInput } from '@/types/player';

/**
 * Fetch list of players with optional search, pagination, and sorting
 */
export function usePlayers(params?: {
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'rating' | 'date';
  sortOrder?: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: ['players', params],
    queryFn: () => getPlayers(params),
    staleTime: 60000, // 60s - player data changes slowly
  });
}

/**
 * Fetch single player by ID
 */
export function usePlayer(id: number) {
  return useQuery({
    queryKey: ['players', id],
    queryFn: () => getPlayer(id),
    enabled: !!id && id > 0,
    staleTime: 60000,
  });
}

/**
 * Create new player mutation
 */
export function useCreatePlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      toast.success('Player created successfully');
    },
    onError: (error: Error) => {
      const message = error.message || '';
      if (message.toLowerCase().includes('email')) {
        toast.error('Email already exists');
      } else if (message.toLowerCase().includes('dupr')) {
        toast.error('DUPR ID already exists');
      } else {
        toast.error('Failed to create player');
      }
    },
  });
}

/**
 * Update existing player mutation
 */
export function useUpdatePlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePlayerInput }) =>
      updatePlayer(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      queryClient.invalidateQueries({ queryKey: ['players', variables.id] });
      toast.success('Player updated successfully');
    },
    onError: (error: Error) => {
      const message = error.message || '';
      if (message.toLowerCase().includes('dupr')) {
        toast.error('DUPR ID already exists');
      } else {
        toast.error('Failed to update player');
      }
    },
  });
}

/**
 * Delete player mutation
 */
export function useDeletePlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      toast.success('Player deleted successfully');
    },
    onError: (error: Error) => {
      const message = error.message || '';
      if (message.toLowerCase().includes('registration')) {
        toast.error('Cannot delete player with tournament registrations');
      } else {
        toast.error('Failed to delete player');
      }
    },
  });
}

/**
 * Delete all players mutation (development only)
 * WARNING: This permanently deletes ALL players from the database
 */
export function useDeleteAllPlayers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllPlayers,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      toast.success(`Successfully deleted ${data.deletedCount} players`, {
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      const message = error.message || 'Failed to delete all players';
      toast.error(message);
    },
  });
}
