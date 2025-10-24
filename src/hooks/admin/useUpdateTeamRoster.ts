import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

// Use admin API endpoint (authenticated mutations)
// Remove /api/public suffix and use /api instead
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://100.125.100.17:3000/api/public').replace('/api/public', '/api');

interface UpdateTeamRosterRequest {
  playerIds: number[];
  name?: string;
  regenerateName?: boolean;
}

interface UpdateTeamRosterResponse {
  id: number;
  name: string;
  source: string;
  poolId: number | null;
  divisionId: number;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  matchesPlayed: number;
  players: Array<{
    id: number;
    name: string;
    doublesRating: number | null;
    singlesRating: number | null;
    duprRating: number | null;
    position: number;
  }>;
}

export function useUpdateTeamRoster(
  tournamentId: number,
  divisionId: number,
  teamId: number
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateTeamRosterRequest): Promise<UpdateTeamRosterResponse> => {
      const response = await axios.put(
        `${API_BASE_URL}/tournaments/${tournamentId}/divisions/${divisionId}/teams/${teamId}/roster`,
        data,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (team) => {
      // Invalidate teams list to refetch
      queryClient.invalidateQueries({
        queryKey: ['admin-teams', tournamentId],
      });

      // Invalidate registrations (team_id updated for added/removed players)
      queryClient.invalidateQueries({
        queryKey: ['tournaments', tournamentId, 'registrations'],
      });

      toast.success(`Team "${team.name}" roster updated successfully!`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.response?.data?.error || 'Failed to update team roster';
      toast.error(message);
    },
  });
}
