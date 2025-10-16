import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';
import { APP_NAME } from '@/utils/constants';

export const Header = () => {
  return (
    <AppBar position="sticky" elevation={2}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <TrophyIcon sx={{ mr: 2, fontSize: 32 }} />
          <Typography
            variant="h6"
            component="h1"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '0.5px',
            }}
          >
            {APP_NAME}
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
