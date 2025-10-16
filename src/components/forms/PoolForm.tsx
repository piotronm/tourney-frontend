import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Button, Stack } from '@mui/material';
import { poolSchema, type PoolFormData } from '@/schemas/poolSchema';

interface PoolFormProps {
  defaultValues?: Partial<PoolFormData>;
  onSubmit: (data: PoolFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

/**
 * Pool Form Component
 * Form for creating or editing pools with validation
 *
 * Features:
 * - React Hook Form integration
 * - Zod schema validation
 * - Real-time validation
 * - Loading states
 * - Helper text for guidance
 */
export const PoolForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: PoolFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PoolFormData>({
    resolver: zodResolver(poolSchema),
    defaultValues: defaultValues || {
      name: '',
      label: '',
      orderIndex: 1,
    },
    mode: 'onChange',
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {/* Pool Name */}
        <TextField
          label="Pool Name"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message || 'e.g., Pool A, Beginner Pool'}
          fullWidth
          required
          disabled={isLoading}
        />

        {/* Pool Label */}
        <TextField
          label="Pool Label"
          {...register('label')}
          error={!!errors.label}
          helperText={errors.label?.message || 'Single letter (A, B, C, etc.)'}
          fullWidth
          required
          disabled={isLoading}
          inputProps={{
            maxLength: 1,
            style: { textTransform: 'uppercase' }
          }}
          onChange={(e) => {
            // Auto-convert to uppercase
            e.target.value = e.target.value.toUpperCase();
          }}
        />

        {/* Display Order */}
        <TextField
          label="Display Order"
          type="number"
          {...register('orderIndex', { valueAsNumber: true })}
          error={!!errors.orderIndex}
          helperText={errors.orderIndex?.message || 'Order in which pools are displayed'}
          fullWidth
          required
          disabled={isLoading}
          inputProps={{ min: 1, max: 100 }}
        />

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || isLoading}
          >
            {mode === 'create' ? 'Create Pool' : 'Save Changes'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
