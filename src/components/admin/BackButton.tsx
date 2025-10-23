/**
 * Back Button Component
 * Standardized back navigation button
 */

import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface BackButtonProps {
  to: string;
  label?: string;
  variant?: 'text' | 'outlined' | 'contained';
  sx?: object;
}

/**
 * Back Button Component
 * Provides consistent "Back to [Parent]" navigation
 *
 * Features:
 * - Arrow icon
 * - Customizable label
 * - Programmatic navigation
 * - Consistent styling
 *
 * @example
 * <BackButton to="/admin/tournaments/1" label="Back to Tournament" />
 */
export const BackButton: FC<BackButtonProps> = ({
  to,
  label = 'Back',
  variant = 'text',
  sx = {}
}) => {
  const navigate = useNavigate();

  return (
    <Button
      variant={variant}
      startIcon={<ArrowBackIcon />}
      onClick={() => navigate(to)}
      sx={{
        mb: 2,
        color: 'text.secondary',
        '&:hover': {
          color: 'primary.main',
          bgcolor: 'primary.lighter'
        },
        ...sx
      }}
    >
      {label}
    </Button>
  );
};
