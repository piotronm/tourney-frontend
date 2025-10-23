/**
 * Breadcrumb Helpers
 * Generates breadcrumb trails for admin pages
 */

export interface Breadcrumb {
  label: string;
  path: string;
}

interface BreadcrumbParams {
  tournamentId?: string;
  tournamentName?: string;
  divisionId?: string;
  divisionName?: string;
  poolId?: string;
  poolName?: string;
  teamId?: string;
  teamName?: string;
  matchId?: string;
  matchName?: string;
}

/**
 * Build breadcrumb trail based on current route and params
 * @param pathname - Current route pathname
 * @param params - Route parameters and entity names
 * @returns Array of breadcrumbs
 */
export function buildBreadcrumbs(
  pathname: string,
  params: BreadcrumbParams = {}
): Breadcrumb[] {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'Dashboard', path: '/admin/dashboard' }
  ];

  const {
    tournamentId,
    tournamentName,
    divisionId,
    divisionName,
    poolId,
    poolName,
    teamId,
    teamName,
    matchId,
    matchName
  } = params;

  // Tournament level
  if (tournamentId) {
    breadcrumbs.push({
      label: tournamentName || `Tournament ${tournamentId}`,
      path: `/admin/tournaments/${tournamentId}`
    });

    // Registrations
    if (pathname.includes('/registrations')) {
      breadcrumbs.push({
        label: 'Registrations',
        path: `/admin/tournaments/${tournamentId}/registrations`
      });
    }

    // Division level
    if (divisionId) {
      breadcrumbs.push({
        label: divisionName || `Division ${divisionId}`,
        path: `/admin/tournaments/${tournamentId}/divisions/${divisionId}`
      });

      // Teams
      if (pathname.includes('/teams')) {
        breadcrumbs.push({
          label: 'Teams',
          path: `/admin/tournaments/${tournamentId}/divisions/${divisionId}/teams`
        });

        if (teamId) {
          breadcrumbs.push({
            label: teamName || `Team ${teamId}`,
            path: `/admin/tournaments/${tournamentId}/divisions/${divisionId}/teams/${teamId}`
          });
        }
      }

      // Pools
      if (pathname.includes('/pools')) {
        breadcrumbs.push({
          label: 'Pools',
          path: `/admin/tournaments/${tournamentId}/divisions/${divisionId}/pools`
        });

        if (poolId) {
          breadcrumbs.push({
            label: poolName || `Pool ${poolId}`,
            path: `/admin/tournaments/${tournamentId}/divisions/${divisionId}/pools/${poolId}`
          });
        }
      }

      // Matches
      if (pathname.includes('/matches')) {
        breadcrumbs.push({
          label: 'Matches',
          path: `/admin/tournaments/${tournamentId}/divisions/${divisionId}/matches`
        });

        if (matchId) {
          breadcrumbs.push({
            label: matchName || `Match ${matchId}`,
            path: `/admin/tournaments/${tournamentId}/divisions/${divisionId}/matches/${matchId}`
          });
        }
      }

      // Bracket
      if (pathname.includes('/bracket')) {
        breadcrumbs.push({
          label: 'Bracket',
          path: `/admin/tournaments/${tournamentId}/divisions/${divisionId}/bracket`
        });
      }

      // Schedule
      if (pathname.includes('/schedule')) {
        breadcrumbs.push({
          label: 'Schedule',
          path: `/admin/tournaments/${tournamentId}/divisions/${divisionId}/schedule`
        });
      }
    }

    // Tournament-level routes
    if (pathname.includes('/divisions') && !divisionId) {
      breadcrumbs.push({
        label: 'Divisions',
        path: `/admin/tournaments/${tournamentId}/divisions`
      });
    }

    if (pathname.includes('/settings')) {
      breadcrumbs.push({
        label: 'Settings',
        path: `/admin/tournaments/${tournamentId}/settings`
      });
    }
  }

  // Top-level admin routes
  if (pathname === '/admin/tournaments' || pathname === '/admin/tournaments/new') {
    breadcrumbs.push({
      label: 'Tournaments',
      path: '/admin/tournaments'
    });

    if (pathname === '/admin/tournaments/new') {
      breadcrumbs.push({
        label: 'Create Tournament',
        path: '/admin/tournaments/new'
      });
    }
  }

  return breadcrumbs;
}
