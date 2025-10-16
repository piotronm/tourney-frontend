import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDivision } from '@/api/admin/divisions';
import { toast } from 'sonner';

export const useDeleteDivision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteDivision(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] });
      toast.success('Division deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete division');
    },
  });
};
