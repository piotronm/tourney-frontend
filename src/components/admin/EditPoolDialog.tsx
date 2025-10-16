import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { PoolForm } from '@/components/forms/PoolForm';
import { useUpdatePool } from '@/hooks/admin/useUpdatePool';
import type { Pool } from '@/types/pool';
import type { PoolFormData } from '@/schemas/poolSchema';

interface EditPoolDialogProps {
  open: boolean;
  pool: Pool | null;
  divisionId: number;
  onClose: () => void;
}

/**
 * Edit Pool Dialog
 * Dialog wrapper for editing an existing pool
 *
 * Features:
 * - Pre-fills form with current pool data
 * - Updates pool on submit
 * - Closes on successful update
 * - Loading state handling
 */
export const EditPoolDialog = ({
  open,
  pool,
  divisionId,
  onClose,
}: EditPoolDialogProps) => {
  const { mutate: updatePool, isPending } = useUpdatePool(divisionId);

  if (!pool) return null;

  const handleSubmit = (data: PoolFormData) => {
    updatePool(
      { poolId: pool.id, data },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Pool</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <PoolForm
          key={pool.id}
          mode="edit"
          defaultValues={{
            name: pool.name,
            label: pool.label,
            orderIndex: pool.orderIndex,
          }}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
