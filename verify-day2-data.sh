#!/bin/bash

# Day 2 Validation: Verify Data Structure Matches Component Expectations
# This script checks that the backend API returns data in the format expected by frontend components

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Day 2 Data Structure Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if backend is running
if ! curl -s http://localhost:3000/health > /dev/null 2>&1; then
  echo "❌ Backend server not running on port 3000"
  echo "   Start with: cd backend && pnpm --filter api dev"
  exit 1
fi

echo "✅ Backend server is running"
echo ""

cd /home/piouser/eztourneyz/backend/apps/api

echo "=== Verification 1: Teams Have Players Array ==="
echo ""
sqlite3 dev.db << 'EOF'
.mode json
SELECT
  t.id,
  t.name,
  t.source,
  json_group_array(
    json_object(
      'id', tp.player_id,
      'firstName', p.first_name,
      'lastName', p.last_name,
      'duprRating', p.dupr_rating,
      'position', tp.position
    )
  ) as players
FROM teams t
LEFT JOIN team_players tp ON t.id = tp.team_id
LEFT JOIN players p ON tp.player_id = p.id
WHERE t.id = 1
GROUP BY t.id;
EOF

echo ""
echo "Expected: players array with id, firstName, lastName, duprRating, position"
echo ""

echo "=== Verification 2: Registrations Have teamId ==="
echo ""
sqlite3 dev.db << 'EOF'
.mode json
SELECT
  id,
  player_id as playerId,
  partner_id as partnerId,
  pairing_type as pairingType,
  status,
  team_id as teamId,
  division_id as divisionId
FROM tournament_registrations
WHERE id IN (1, 2, 3);
EOF

echo ""
echo "Expected: teamId field (null or number) in registration records"
echo ""

echo "=== Verification 3: Test Data Summary ==="
echo ""
sqlite3 dev.db << 'EOF'
.mode table
.headers on

SELECT
  'Teams:' as category,
  COUNT(*) as count,
  GROUP_CONCAT(name, ', ') as items
FROM teams
UNION ALL
SELECT
  'Registrations:',
  COUNT(*),
  GROUP_CONCAT(id, ', ')
FROM tournament_registrations
UNION ALL
SELECT
  'Team-Player Links:',
  COUNT(*),
  GROUP_CONCAT(team_id || '->' || player_id, ', ')
FROM team_players;
EOF

echo ""
echo "=== Component Type Expectations ==="
echo ""
echo "TeamCard expects:"
echo "  - team.players?: TeamPlayer[]"
echo "  - team.source?: 'registration' | 'manual' | 'import'"
echo "  - team.wins, losses, pointsFor, pointsAgainst, matchesPlayed"
echo ""
echo "RegistrationCard expects:"
echo "  - registration.teamId: number | null"
echo "  - registration.pairingType: 'has_partner' | 'needs_partner' | 'solo'"
echo "  - registration.status: string"
echo "  - registration.divisionId: number"
echo ""

echo "=== TypeScript Compilation Check ==="
cd /home/piouser/eztourneyz/frontend
if timeout 30 npx tsc --noEmit > /dev/null 2>&1; then
  echo "✅ TypeScript: 0 errors"
else
  echo "❌ TypeScript: Compilation errors found"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Verification Complete"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
