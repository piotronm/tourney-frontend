import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import type { PoolStandings } from '@/api/types';

interface StandingsTableProps {
  standings: PoolStandings[];
}

export const StandingsTable = ({ standings }: StandingsTableProps) => {
  return (
    <Box>
      {standings.map((pool) => (
        <Accordion key={pool.poolId} defaultExpanded={standings.length === 1}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Typography variant="h6">{pool.poolName}</Typography>
              <Chip
                label={`${pool.standings.length} Teams`}
                size="small"
                variant="outlined"
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Rank</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Team</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Played</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Wins</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Losses</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>PF</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>PA</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Diff</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pool.standings.map((team) => (
                    <TableRow
                      key={team.teamId}
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <TableCell>
                        <Chip
                          label={team.rank}
                          size="small"
                          color={team.rank === 1 ? 'primary' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {team.teamName}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">{team.matchesPlayed}</TableCell>
                      <TableCell align="center">{team.wins}</TableCell>
                      <TableCell align="center">{team.losses}</TableCell>
                      <TableCell align="center">{team.pointsFor}</TableCell>
                      <TableCell align="center">{team.pointsAgainst}</TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          color={
                            team.pointDiff > 0
                              ? 'success.main'
                              : team.pointDiff < 0
                                ? 'error.main'
                                : 'text.secondary'
                          }
                        >
                          {team.pointDiff > 0 ? '+' : ''}
                          {team.pointDiff}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};
