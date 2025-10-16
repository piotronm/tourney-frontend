import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { PoolForm } from '@/components/forms/PoolForm';
import { useCreatePool } from '@/hooks/admin/useCreatePool';
import type { PoolFormData } from '@/schemas/poolSchema';

interface CreatePoolDialogProps {
  open: boolean;
  divisionId: number;
  onClose: () => void;
  nextOrderIndex: number;
  nextLabel: string;
}

/**
 * Create Pool Dialog
 * Dialog wrapper for creating a new pool with auto-suggested values
 *
 * Features:
 * - Auto-suggests pool name (Pool A, Pool B, etc.)
 * - Auto-increments order index
 * - Auto-suggests next available label
 * - Closes on successful creation
 * - Loading state handling
 */
export const CreatePoolDialog = ({
  open,
  divisionId,
  onClose,
  nextOrderIndex,
  nextLabel,
}: CreatePoolDialogProps) => {
  const { mutate: createPool, isPending } = useCreatePool(divisionId);

  const handleSubmit = (data: PoolFormData) => {
    createPool(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Pool</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <PoolForm
          mode="create"
          defaultValues={{
            name: `Pool ${nextLabel}`,
            label: nextLabel,
            orderIndex: nextOrderIndex,
          }}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
