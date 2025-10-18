import { Card, CardContent, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, Button, Box } from '@mui/material';
import { EmojiEvents, Groups, SportsTennis, Assessment } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'division_created' | 'teams_imported' | 'matches_generated' | 'match_scored';
  title: string;
  subtitle: string;
  timestamp: Date;
}

export function RecentActivityFeed() {
  // Placeholder data - replace with real API data later
  const activities: Activity[] = [
    {
      id: '1',
      type: 'match_scored',
      title: 'Match score entered',
      subtitle: 'Women\'s 3.5 - Pool A, Match #3',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    },
    {
      id: '2',
      type: 'matches_generated',
      title: 'Matches generated',
      subtitle: 'Men\'s 4.0 - 24 matches created',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    },
    {
      id: '3',
      type: 'teams_imported',
      title: 'Teams imported',
      subtitle: 'Mixed 3.5 - 16 teams added',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: '4',
      type: 'division_created',
      title: 'Division created',
      subtitle: 'Women\'s 4.5',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    },
  ];

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'division_created':
        return <EmojiEvents />;
      case 'teams_imported':
        return <Groups />;
      case 'matches_generated':
        return <Assessment />;
      case 'match_scored':
        return <SportsTennis />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'division_created':
        return 'primary.main';
      case 'teams_imported':
        return 'success.main';
      case 'matches_generated':
        return 'info.main';
      case 'match_scored':
        return 'warning.main';
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Recent Activity</Typography>
          <Button size="small">View All</Button>
        </Box>

        <List sx={{ pt: 0 }}>
          {activities.map((activity, index) => (
            <ListItem
              key={activity.id}
              sx={{
                px: 0,
                borderBottom: index < activities.length - 1 ? '1px solid' : 'none',
                borderColor: 'divider',
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: getActivityColor(activity.type) }}>
                  {getActivityIcon(activity.type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={activity.title}
                secondary={
                  <>
                    {activity.subtitle}
                    <Typography component="span" variant="body2" sx={{ display: 'block', color: 'text.secondary', fontSize: '0.75rem' }}>
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
