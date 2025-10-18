/**
 * AdminTournamentsPage - List all tournaments (admin view)
 * Phase 4B - Tournament admin entry point
 */

import { Box, Button, Card, CardContent, Typography, CircularProgress, IconButton, Chip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTournaments } from '@/hooks/admin/useTournaments';
import { useDeleteTournament } from '@/hooks/admin/useDeleteTournament';

export const AdminTournamentsPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useTournaments();
  const { mutate: deleteTournament } = useDeleteTournament();

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete tournament "${name}"? This will delete all divisions, teams, and matches.`)) {
      deleteTournament(id);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error loading tournaments: {error.message}</Typography>
      </Box>
    );
  }

  const tournaments = data?.tournaments || [];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Tournaments
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/tournaments/new')}
        >
          Create Tournament
        </Button>
      </Box>

      {/* Tournaments List */}
      {tournaments.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary" align="center">
              No tournaments found. Create your first tournament to get started.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'grid', gap: 2 }}>
          {tournaments.map((tournament) => (
            <Card
              key={tournament.id}
              sx={{
                cursor: 'pointer',
                '&:hover': { boxShadow: 3 },
                transition: 'box-shadow 0.2s',
              }}
              onClick={() => navigate(`/admin/tournaments/${tournament.id}`)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Typography variant="h6" component="h2">
                        {tournament.name}
                      </Typography>
                      <Chip
                        label={tournament.status.toUpperCase()}
                        size="small"
                        color={
                          tournament.status === 'active' ? 'success' :
                          tournament.status === 'draft' ? 'default' :
                          tournament.status === 'completed' ? 'primary' :
                          'secondary'
                        }
                      />
                    </Box>
                    {tournament.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {tournament.description}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Divisions: {tournament.stats.divisions}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Teams: {tournament.stats.teams}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Matches: {tournament.stats.matches}
                      </Typography>
                    </Box>
                    {(tournament.startDate || tournament.endDate) && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {tournament.startDate && new Date(tournament.startDate).toLocaleDateString()}
                        {tournament.startDate && tournament.endDate && ' - '}
                        {tournament.endDate && new Date(tournament.endDate).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }} onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/admin/tournaments/${tournament.id}/edit`)}
                      title="Edit tournament"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(tournament.id, tournament.name)}
                      title="Delete tournament"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};
