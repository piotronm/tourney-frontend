import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Typography,
} from '@mui/material';
import { divisionSchema, type DivisionFormData } from '@/schemas/divisionSchema';

interface DivisionFormProps {
  mode: 'create' | 'edit';
  defaultValues?: DivisionFormData;
  onSubmit: (data: DivisionFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

/**
 * Division form component
 * Used for both creating and editing divisions
 *
 * Features:
 * - React Hook Form with Zod validation
 * - Real-time validation errors
 * - Disabled state during submission
 * - Cancel button
 */
export const DivisionForm: FC<DivisionFormProps> = ({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<DivisionFormData>({
    resolver: zodResolver(divisionSchema),
    defaultValues: defaultValues || { name: '' },
  });

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            {mode === 'create' ? 'Create New Division' : 'Edit Division'}
          </Typography>

          <Box sx={{ mt: 3 }}>
            <TextField
              {...register('name')}
              label="Division Name"
              fullWidth
              required
              autoFocus
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={isSubmitting}
              placeholder="e.g., Spring 2025 Tournament"
            />
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
          <Button onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || (mode === 'edit' && !isDirty)}
          >
            {isSubmitting
              ? mode === 'create'
                ? 'Creating...'
                : 'Saving...'
              : mode === 'create'
              ? 'Create Division'
              : 'Save Changes'}
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};
