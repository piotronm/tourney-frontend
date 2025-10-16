import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateMatches } from '@/api/admin/matches';
import type { GenerateMatchesDto } from '@/api/types';
import { toast } from 'sonner';

export const useGenerateMatches = (divisionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateMatchesDto) => generateMatches(divisionId, data),
    onSuccess: (result) => {
      // Invalidate matches queries to refetch
      queryClient.invalidateQueries({ queryKey: ['matches', divisionId] });

      // Invalidate division to update match count stats
      queryClient.invalidateQueries({ queryKey: ['division', divisionId] });

      // Show success with match count
      toast.success(`Generated ${result.count} matches successfully!`);
    },
    onError: (error: unknown) => {
      console.error('Match generation error:', error);

      // Show user-friendly error
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to generate matches';
      toast.error(message);
    },
  });
};
