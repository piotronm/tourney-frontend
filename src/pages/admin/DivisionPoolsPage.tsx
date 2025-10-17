import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  People as PeopleIcon,
  ArrowBack as ArrowBackIcon,
  AutoFixHigh as AutoFixHighIcon,
} from '@mui/icons-material';
import { usePools } from '@/hooks/admin/usePools';
import { useDeletePool } from '@/hooks/admin/useDeletePool';
import { useDivision } from '@/hooks/useDivision';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { EmptyState } from '@/components/ui/EmptyState';
import { CreatePoolDialog } from '@/components/admin/CreatePoolDialog';
import { DeletePoolDialog } from '@/components/admin/DeletePoolDialog';
import { EditPoolDialog } from '@/components/admin/EditPoolDialog';
import { GenerateMatchesDialog } from '@/components/admin/GenerateMatchesDialog';
import type { Pool } from '@/types/pool';

/**
 * Division Pools Page
 * Main page for managing pools within a division
 *
 * Features:
 * - List all pools in division
 * - Create new pools with auto-suggestions
 * - Delete pools with confirmation
 * - View teams assigned to each pool
 * - Empty state for no pools
 * - Breadcrumb navigation
 */
export const DivisionPoolsPage = () => {
  const { id: divisionId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const parsedDivisionId = parseInt(divisionId!, 10);

  const { data: division, isLoading: divisionLoading } = useDivision(parsedDivisionId);
  const { data: pools, isLoading: poolsLoading, error } = usePools(parsedDivisionId);
  const { mutate: deletePool, isPending: isDeleting } = useDeletePool(parsedDivisionId);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    pool: Pool | null;
  }>({ open: false, pool: null });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    pool: Pool | null;
  }>({ open: false, pool: null });

  // Loading state
  if (divisionLoading || poolsLoading) {
    return <Loading />;
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg">
        <ErrorMessage message="Failed to load pools" />
      </Container>
    );
  }

  // Division not found
  if (!division) {
    return (
      <Container maxWidth="lg">
        <ErrorMessage message="Division not found" />
      </Container>
    );
  }

  const sortedPools = pools?.sort((a, b) => a.orderIndex - b.orderIndex) || [];

  // Calculate next label and order index
  const getNextLabel = () => {
    if (!pools || pools.length === 0) return 'A';
    const lastLabel = sortedPools[sortedPools.length - 1].label;
    return String.fromCharCode(lastLabel.charCodeAt(0) + 1);
  };

  const getNextOrderIndex = () => {
    if (!pools || pools.length === 0) return 1;
    return sortedPools[sortedPools.length - 1].orderIndex + 1;
  };

  const handleEditClick = (pool: Pool) => {
    setEditDialog({ open: true, pool });
  };

  const handleDeleteClick = (pool: Pool) => {
    setDeleteDialog({ open: true, pool });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.pool) {
      deletePool(deleteDialog.pool.id, {
        onSuccess: () => {
          setDeleteDialog({ open: false, pool: null });
        },
      });
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/admin/dashboard')}
        >
          Dashboard
        </Link>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/admin/divisions')}
        >
          Divisions
        </Link>
        <Typography color="text.primary">{division.name}</Typography>
        <Typography color="text.primary">Pools</Typography>
      </Breadcrumbs>

      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/admin/divisions')}
        sx={{ mb: 2 }}
      >
        Back to Divisions
      </Button>

      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Manage Pools
          </Typography>
          <Typography color="text.secondary">
            {division.name}
          </Typography>
        </div>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="text"
            onClick={() => navigate(`/admin/divisions/${divisionId}/matches`)}
          >
            View Matches
          </Button>
          <Button
            variant="outlined"
            startIcon={<AutoFixHighIcon />}
            onClick={() => setGenerateDialogOpen(true)}
            disabled={sortedPools.length === 0}
          >
            Generate Matches
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Pool
          </Button>
        </Box>
      </Box>

      {/* Empty State */}
      {sortedPools.length === 0 && (
        <EmptyState
          title="No pools created yet"
          description="Create pools to organize teams and generate matches"
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Create First Pool
            </Button>
          }
        />
      )}

      {/* Pools List */}
      {sortedPools.length > 0 && (
        <Stack spacing={2}>
          {sortedPools.map((pool) => {
            const teamCount = pool.teams?.length || 0;

            return (
              <Accordion key={pool.id} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Chip label={pool.label} color="primary" />
                    <Typography variant="h6">{pool.name}</Typography>
                    <Chip
                      icon={<PeopleIcon />}
                      label={`${teamCount} team${teamCount !== 1 ? 's' : ''}`}
                      size="small"
                      sx={{ ml: 'auto', mr: 2 }}
                    />
                  </Box>
                </AccordionSummary>

                <AccordionDetails>
                  {/* Teams in Pool */}
                  {teamCount > 0 ? (
                    <Stack spacing={1} sx={{ mb: 2 }}>
                      {pool.teams!.map((team, index) => (
                        <Box
                          key={team.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 1,
                            bgcolor: 'background.default',
                            borderRadius: 1,
                          }}
                        >
                          <Chip label={`Seed ${index + 1}`} size="small" sx={{ mr: 2 }} />
                          <Typography>{team.name}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      No teams assigned to this pool yet.{' '}
                      <Link
                        component="button"
                        onClick={() => navigate(`/admin/divisions/${divisionId}/teams`)}
                        sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Assign teams →
                      </Link>
                    </Alert>
                  )}

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditClick(pool)}
                    >
                      Edit Pool
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteClick(pool)}
                    >
                      Delete Pool
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Stack>
      )}

      {/* Create Pool Dialog */}
      <CreatePoolDialog
        open={createDialogOpen}
        divisionId={parsedDivisionId}
        onClose={() => setCreateDialogOpen(false)}
        nextOrderIndex={getNextOrderIndex()}
        nextLabel={getNextLabel()}
      />

      {/* Edit Pool Dialog */}
      <EditPoolDialog
        open={editDialog.open}
        pool={editDialog.pool}
        divisionId={parsedDivisionId}
        onClose={() => setEditDialog({ open: false, pool: null })}
      />

      {/* Delete Pool Dialog */}
      <DeletePoolDialog
        open={deleteDialog.open}
        pool={deleteDialog.pool}
        onClose={() => setDeleteDialog({ open: false, pool: null })}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />

      {/* Generate Matches Dialog */}
      <GenerateMatchesDialog
        open={generateDialogOpen}
        divisionId={divisionId!}
        pools={sortedPools}
        onClose={() => setGenerateDialogOpen(false)}
      />
    </Container>
  );
};
