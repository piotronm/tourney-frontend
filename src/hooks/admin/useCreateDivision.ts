import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDivision } from '@/api/admin/divisions';
import type { CreateDivisionDto } from '@/types/division';
import { toast } from 'sonner';

export const useCreateDivision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDivisionDto) => createDivision(data),
    onSuccess: (division) => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] });
      toast.success(`Division "${division.name}" created successfully!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create division');
    },
  });
};
