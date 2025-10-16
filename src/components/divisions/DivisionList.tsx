import { Box } from '@mui/material';
import { DivisionCard } from './DivisionCard';
import type { Division } from '@/api/types';

interface DivisionListProps {
  divisions: Division[];
  onDivisionClick?: (division: Division) => void;
}

export const DivisionList = ({ divisions, onDivisionClick }: DivisionListProps) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        gap: 3,
      }}
    >
      {divisions.map((division) => (
        <DivisionCard key={division.id} division={division} onClick={onDivisionClick} />
      ))}
    </Box>
  );
};
