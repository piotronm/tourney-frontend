import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import type { Team } from '@/types/team';
import type { Pool } from '@/types/pool';
import { getInitials, getCombinedDupr } from '@/utils/formatters';

// Pool color mapping - ensures consistent colors across the app
export const POOL_COLORS: Array<'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error'> = [
  'primary',    // Blue
  'secondary',  // Pink/Purple
  'success',    // Green
  'info',       // Light Blue
  'warning',    // Orange
  'error',      // Red
];

export function getPoolColor(poolId: number | null, pools: Pool[]): 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'default' {
  if (!poolId) return 'default';
  const pool = pools.find(p => p.id === poolId);
  if (!pool) return 'default';

  // Use pool's orderIndex to determine color (ensures consistency)
  const index = (pool.orderIndex - 1) % POOL_COLORS.length;
  return POOL_COLORS[index];
}

interface TeamAssignmentSidebarProps {
  teams: Team[];
  pools: Pool[];
  onAssignTeam: (teamId: number, poolId: number | null) => void;
  isLoading?: boolean;
}

export function TeamAssignmentSidebar({
  teams,
  pools,
  onAssignTeam,
  isLoading = false,
}: TeamAssignmentSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'assigned' | 'unassigned'>('all');

  // Filter and search teams
  const filteredTeams = useMemo(() => {
    let filtered = teams;

    // Filter by status
    if (filterStatus === 'assigned') {
      filtered = filtered.filter(team => team.poolId !== null);
    } else if (filterStatus === 'unassigned') {
      filtered = filtered.filter(team => team.poolId === null);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(team =>
        team.name.toLowerCase().includes(query)
      );
    }

    // Sort: unassigned first, then by DUPR
    return filtered.sort((a, b) => {
      // Unassigned teams first
      if (a.poolId === null && b.poolId !== null) return -1;
      if (a.poolId !== null && b.poolId === null) return 1;

      // Then by DUPR (highest first)
      const duprA = a.players && a.players.length > 0 ? getCombinedDupr(a.players) : 0;
      const duprB = b.players && b.players.length > 0 ? getCombinedDupr(b.players) : 0;
      return duprB - duprA;
    });
  }, [teams, searchQuery, filterStatus]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = teams.length;
    const assigned = teams.filter(team => team.poolId !== null).length;
    const unassigned = total - assigned;
    return { total, assigned, unassigned };
  }, [teams]);

  const handleTeamClick = (team: Team, event: React.MouseEvent<HTMLElement>) => {
    setSelectedTeam(team);
    setAnchorEl(event.currentTarget);
  };

  const handleAssignToPool = (poolId: number | null) => {
    if (selectedTeam) {
      onAssignTeam(selectedTeam.id, poolId);
    }
    handleCloseMenu();
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedTeam(null);
  };

  const getPoolName = (poolId: number | null): string => {
    if (!poolId) return '';
    const pool = pools.find(p => p.id === poolId);
    return pool?.name || '';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Teams
        </Typography>

        {/* Stats */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={`${stats.total} Total`}
            size="small"
            onClick={() => setFilterStatus('all')}
            color={filterStatus === 'all' ? 'primary' : 'default'}
            variant={filterStatus === 'all' ? 'filled' : 'outlined'}
          />
          <Chip
            label={`${stats.assigned} Assigned`}
            size="small"
            onClick={() => setFilterStatus('assigned')}
            color={filterStatus === 'assigned' ? 'success' : 'default'}
            variant={filterStatus === 'assigned' ? 'filled' : 'outlined'}
          />
          <Chip
            label={`${stats.unassigned} Unassigned`}
            size="small"
            onClick={() => setFilterStatus('unassigned')}
            color={filterStatus === 'unassigned' ? 'warning' : 'default'}
            variant={filterStatus === 'unassigned' ? 'filled' : 'outlined'}
          />
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search teams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery('')}>
                  <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Teams List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {filteredTeams.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {searchQuery
                ? 'No teams found'
                : stats.total === 0
                ? 'No teams created yet'
                : 'No teams in this filter'}
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filteredTeams.map((team) => {
              const combinedDupr = team.players && team.players.length > 0
                ? getCombinedDupr(team.players)
                : null;
              const poolName = getPoolName(team.poolId);
              const isAssigned = team.poolId !== null;

              return (
                <ListItem
                  key={team.id}
                  disablePadding
                  secondaryAction={
                    <IconButton
                      size="small"
                      onClick={(e) => handleTeamClick(team, e)}
                      disabled={isLoading}
                    >
                      <MoreVertIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  }
                >
                  <ListItemButton
                    onClick={(e) => handleTeamClick(team, e)}
                    disabled={isLoading}
                    sx={{
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        badgeContent={
                          isAssigned ? (
                            <CheckCircleIcon sx={{ fontSize: 14, color: 'success.main' }} />
                          ) : (
                            <WarningIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                          )
                        }
                        overlap="circular"
                      >
                        <Avatar sx={{ width: 36, height: 36, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
                          {getInitials(team.name)}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                          {team.name}
                        </Typography>
                      }
                      secondary={
                        <span style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                          {/* DUPR */}
                          {combinedDupr !== null && (
                            <span style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.6)' }}>
                              DUPR: {combinedDupr.toFixed(2)}
                            </span>
                          )}

                          {/* Pool Assignment */}
                          <span>
                            {isAssigned ? (
                              <Chip
                                label={poolName}
                                size="small"
                                color={getPoolColor(team.poolId, pools)}
                                sx={{
                                  height: 18,
                                  fontSize: '0.65rem',
                                  width: 'fit-content',
                                }}
                              />
                            ) : (
                              <Chip
                                label="Unassigned"
                                size="small"
                                color="warning"
                                variant="outlined"
                                sx={{
                                  height: 18,
                                  fontSize: '0.65rem',
                                  width: 'fit-content',
                                }}
                              />
                            )}
                          </span>
                        </span>
                      }
                      secondaryTypographyProps={{
                        component: 'span',
                        variant: 'body2',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>

      {/* Assignment Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem disabled sx={{ opacity: 1, '&.Mui-disabled': { opacity: 1 } }}>
          <Typography variant="caption" color="text.secondary">
            Assign {selectedTeam?.name} to:
          </Typography>
        </MenuItem>
        <Divider />

        {pools.map((pool) => {
          const isCurrentPool = selectedTeam?.poolId === pool.id;
          return (
            <MenuItem
              key={pool.id}
              onClick={() => handleAssignToPool(pool.id)}
              selected={isCurrentPool}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <Typography variant="body2">{pool.name}</Typography>
                {isCurrentPool && (
                  <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main', ml: 'auto' }} />
                )}
              </Box>
            </MenuItem>
          );
        })}

        {selectedTeam?.poolId !== null && [
          <Divider key="divider" />,
          <MenuItem key="remove" onClick={() => handleAssignToPool(null)}>
            <Typography variant="body2" color="error">
              Remove from pool
            </Typography>
          </MenuItem>
        ]}
      </Menu>

      {/* Help Text */}
      {stats.unassigned > 0 && (
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Alert severity="info" sx={{ py: 0.5 }}>
            <Typography variant="caption">
              Click a team to assign to a pool
            </Typography>
          </Alert>
        </Box>
      )}
    </Box>
  );
}
