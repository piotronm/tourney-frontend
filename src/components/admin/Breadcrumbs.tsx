/**
 * Admin Breadcrumbs Component
 * Displays hierarchical navigation trail
 */

import type { FC } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Breadcrumbs, Link as MuiLink, Typography, Box } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { buildBreadcrumbs, type Breadcrumb } from '@/utils/breadcrumbHelpers';

interface AdminBreadcrumbsProps {
  tournamentName?: string;
  divisionName?: string;
  poolName?: string;
  teamName?: string;
  matchName?: string;
}

/**
 * Breadcrumbs component that auto-generates trail based on route
 *
 * Usage:
 * - Add to AdminLayout for automatic breadcrumbs on all pages
 * - Optionally pass entity names for better labels
 *
 * @example
 * <AdminBreadcrumbs tournamentName="Summer League 2025" divisionName="Men's 4.0" />
 */
export const AdminBreadcrumbs: FC<AdminBreadcrumbsProps> = ({
  tournamentName,
  divisionName,
  poolName,
  teamName,
  matchName
}) => {
  const location = useLocation();
  const params = useParams();

  const breadcrumbs = buildBreadcrumbs(location.pathname, {
    tournamentId: params.tournamentId,
    tournamentName,
    divisionId: params.divisionId,
    divisionName,
    poolId: params.poolId,
    poolName,
    teamId: params.teamId,
    teamName,
    matchId: params.matchId,
    matchName
  });

  // Don't show breadcrumbs if we're on the dashboard (only 1 breadcrumb)
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <Box sx={{ mb: 3, mt: 1 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            mx: 1
          }
        }}
      >
        {breadcrumbs.map((crumb: Breadcrumb, index: number) => {
          const isLast = index === breadcrumbs.length - 1;

          if (isLast) {
            return (
              <Typography
                key={crumb.path}
                color="text.primary"
                sx={{ fontWeight: 600 }}
              >
                {crumb.label}
              </Typography>
            );
          }

          return (
            <MuiLink
              key={crumb.path}
              component={Link}
              to={crumb.path}
              underline="hover"
              color="inherit"
              sx={{
                display: 'flex',
                alignItems: 'center',
                '&:hover': {
                  color: 'primary.main'
                }
              }}
            >
              {crumb.label}
            </MuiLink>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};
