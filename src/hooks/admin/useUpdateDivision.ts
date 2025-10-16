import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDivision } from '@/api/admin/divisions';
import type { UpdateDivisionDto } from '@/types/division';
import { toast } from 'sonner';

export const useUpdateDivision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDivisionDto }) =>
      updateDivision(id, data),
    onSuccess: (division) => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] });
      queryClient.invalidateQueries({ queryKey: ['division', division.id] });
      toast.success(`Division "${division.name}" updated successfully!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update division');
    },
  });
};
