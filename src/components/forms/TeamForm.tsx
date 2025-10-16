import type { FC } from 'react';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Typography,
  MenuItem,
} from '@mui/material';
import { teamSchema, type TeamFormData } from '@/schemas/teamSchema';
import type { Pool } from '@/types/pool'; // You'll create this in backend

interface TeamFormProps {
  mode: 'create' | 'edit';
  defaultValues?: TeamFormData;
  pools?: Pool[]; // Available pools for assignment
  onSubmit: (data: TeamFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

/**
 * Team form component
 * Used for both creating and editing teams
 *
 * Features:
 * - React Hook Form with Zod validation
 * - Pool assignment dropdown
 * - Pool seed input (conditional)
 * - Real-time validation errors
 * - Disabled state during submission
 */
export const TeamForm: FC<TeamFormProps> = ({
  mode,
  defaultValues,
  pools = [],
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: defaultValues || {
      name: '',
      poolId: '',
      poolSeed: '',
    },
  });

  // Reset form when defaultValues change (important for edit mode)
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const selectedPoolId = watch('poolId');
  const showPoolSeed = selectedPoolId && selectedPoolId !== '';

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            {mode === 'create' ? 'Add New Team' : 'Edit Team'}
          </Typography>

          {/* Team Name */}
          <Box sx={{ mt: 3 }}>
            <TextField
              {...register('name')}
              label="Team Name"
              fullWidth
              required
              autoFocus
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={isSubmitting}
              placeholder="e.g., Team Alpha"
            />
          </Box>

          {/* Pool Assignment */}
          <Box sx={{ mt: 2 }}>
            <Controller
              name="poolId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Assign to Pool"
                  fullWidth
                  error={!!errors.poolId}
                  disabled={isSubmitting}
                  helperText={
                    errors.poolId?.message ||
                    'Optional - can be assigned later'
                  }
                >
                  <MenuItem value="">
                    <em>None (unassigned)</em>
                  </MenuItem>
                  {pools.map((pool) => (
                    <MenuItem key={pool.id} value={pool.id.toString()}>
                      {pool.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          {/* Pool Seed (conditional) */}
          {showPoolSeed && (
            <Box sx={{ mt: 2 }}>
              <TextField
                {...register('poolSeed')}
                label="Pool Seed"
                type="number"
                fullWidth
                error={!!errors.poolSeed}
                helperText={
                  errors.poolSeed?.message ||
                  'Team ranking within pool (1 = highest)'
                }
                disabled={isSubmitting}
                inputProps={{ min: 1, step: 1 }}
              />
            </Box>
          )}
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
                ? 'Adding...'
                : 'Saving...'
              : mode === 'create'
              ? 'Add Team'
              : 'Save Changes'}
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};
