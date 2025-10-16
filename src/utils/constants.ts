export const APP_NAME = 'Tournament Manager';
export const APP_DESCRIPTION = 'Browse and view tournament divisions, standings, and matches';

export const ROUTES = {
  HOME: '/',
  DIVISIONS: '/divisions',
  DIVISION_DETAIL: '/divisions/:id',
  STANDINGS: '/divisions/:id/standings',
  MATCHES: '/divisions/:id/matches',
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
