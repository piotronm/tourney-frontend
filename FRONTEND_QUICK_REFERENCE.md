# Tournament Manager Frontend - Quick Reference

**Version:** 1.0.0 | **Status:** ✅ Production Ready | **Phase:** 1 (Read-Only Viewer)

---

## TL;DR - What This App Does

A React + TypeScript web app where users can:
- ✅ Browse tournament divisions
- ✅ Search tournaments by name
- ✅ View live team standings (auto-refreshes every 30s)
- ✅ See match schedules and results
- ✅ Filter matches by pool and status (pending/completed)
- ❌ **Cannot** modify any data (read-only)

**Access:** http://100.125.100.17:5173

---

## Tech Stack in 30 Seconds

```
React 19 + TypeScript + Vite + Material-UI
├── TanStack Query (server state & caching)
├── React Router (client-side routing)
├── Axios (HTTP client)
└── date-fns (date formatting)
```

**Bundle:** 666KB (209KB gzipped) | **Files:** 31 TypeScript files | **LOC:** ~1,350

---

## Routes at a Glance

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | HomePage | Landing page with hero |
| `/divisions` | DivisionsPage | Browse all tournaments (with search & pagination) |
| `/divisions/:id` | DivisionDetailPage | Container with tabs |
| `/divisions/:id/standings` | StandingsPage | Team rankings (live, 30s refresh) |
| `/divisions/:id/matches` | MatchesPage | Match schedule (filter by pool/status) |
| `/*` | NotFoundPage | 404 handler |

---

## Key Features

### 🔍 Search & Filter
- **Divisions:** Real-time search with 300ms debounce
- **Matches:** Filter by pool + status (pending/completed)
- **Pagination:** 20 items per page

### 📊 Live Data
- **Standings:** Auto-refresh every 30 seconds
- **Smart Caching:** TanStack Query caches for 15-60s
- **Loading States:** Spinner + error handling on all pages

### 🎨 UI/UX
- **Material Design:** Clean, modern MUI components
- **Responsive:** Mobile-first, works on all screen sizes
- **Accessibility:** WCAG AA compliant
- **Color-Coded:** Point differentials (green/red), status chips

---

## Data Model (Quick)

```typescript
Division {
  id, name, createdAt,
  stats: { teams, pools, matches, completedMatches }
}

Match {
  id, poolId, poolName, roundNumber, matchNumber,
  teamAName, teamBName, scoreA, scoreB,
  status: 'pending' | 'completed'
}

TeamStanding {
  rank, teamName, wins, losses,
  pointsFor, pointsAgainst, pointDiff
}
```

---

## API Endpoints

```bash
Base: http://100.125.100.17:3000/api/public

GET /divisions                    # List with ?limit, ?offset, ?search
GET /divisions/:id                # Single division + pools
GET /divisions/:id/standings      # Standings by pool
GET /divisions/:id/matches        # Matches with filters
```

All list endpoints return:
```typescript
{ data: T[], meta: { total, limit, offset } }
```

---

## Project Structure (Simplified)

```
src/
├── api/           # axios client + API functions
├── components/    # React components (layout, ui, features)
├── hooks/         # TanStack Query hooks (useDivisions, etc.)
├── pages/         # Route pages (HomePage, DivisionsPage, etc.)
├── utils/         # formatters + constants
├── main.tsx       # Entry point (providers setup)
├── router.tsx     # Route config
└── theme.ts       # MUI customization
```

---

## Development Commands

```bash
# Start dev server
npm run dev                      # → http://localhost:5173

# Type check
npx tsc --noEmit                 # Zero errors = good

# Lint
npm run lint                     # ESLint checks

# Build
npm run build                    # → dist/ folder

# Verify
./check-ts-errors.sh             # Custom TS checker
./health-check.sh                # Full health check
```

---

## State Management Strategy

**TanStack Query** handles ALL server state:
- Automatic caching (15s-60s stale time)
- Background refetching when stale
- Loading/error states built-in
- Auto-deduplication of requests
- Optimistic updates (ready for phase 2)

**No Redux/Zustand needed** - only server state, no complex client state.

---

## Key Files for New Developers

1. **`src/main.tsx`** - App setup with providers
2. **`src/router.tsx`** - All routes defined here
3. **`src/api/types.ts`** - TypeScript interfaces (read this first!)
4. **`src/hooks/useDivisions.ts`** - Example of TanStack Query hook
5. **`src/pages/DivisionsPage.tsx`** - Example of full-featured page

---

## Common Tasks

### Add a New Page
1. Create `src/pages/NewPage.tsx`
2. Add route in `src/router.tsx`
3. Create hook in `src/hooks/` if fetching data
4. Add API function in `src/api/` if needed

### Add a New Component
1. Create in appropriate folder (`components/ui/`, etc.)
2. Export with named export
3. Use MUI's `sx` prop for styling
4. Import types with `import type { ... }`

### Call a New API Endpoint
1. Add interface to `src/api/types.ts`
2. Add function to `src/api/[feature].ts`
3. Create hook in `src/hooks/use[Feature].ts`
4. Use hook in component

---

## TypeScript Tips

### Must Use `import type` for Types
```typescript
// ✅ Correct
import type { Match } from '@/api/types';

// ❌ Wrong (causes build error)
import { Match } from '@/api/types';
```

**Why?** `verbatimModuleSyntax: true` in tsconfig requires explicit type imports.

### Path Aliases
```typescript
// Use @ alias for all imports
import { Loading } from '@/components/ui/Loading';

// Not relative paths
import { Loading } from '../../components/ui/Loading';
```

---

## Styling Approach

**MUI `sx` prop** for ALL styling (no CSS files):
```typescript
<Box sx={{
  display: 'flex',
  gap: 2,
  p: 3,           // padding: theme.spacing(3)
  bgcolor: 'primary.main',
  '&:hover': { opacity: 0.8 }
}}>
```

**Theme customization** in `src/theme.ts`:
- Primary color: `#1976d2` (blue)
- Component overrides (Card, Button, etc.)

---

## Performance Notes

### What's Fast
✅ Client-side routing (instant navigation)
✅ Query caching (no duplicate API calls)
✅ Debounced search (prevents spam)

### What Could Be Better
⚠️ Bundle size (666KB - could code-split)
⚠️ Polling instead of WebSocket (30s delay)
⚠️ No virtual scrolling (fine for current data size)

---

## Debugging

### Browser Console Errors?
1. Check Network tab for failed API calls
2. Look at React Query DevTools (bottom-right corner)
3. Check `http://100.125.100.17:3000/health`

### TypeScript Errors?
```bash
./check-ts-errors.sh              # Shows all errors
npx tsc --noEmit                  # Raw TypeScript check
```

### Build Failing?
```bash
npm run build 2>&1 | tail -50     # See last 50 lines
```

---

## Phase 2 Preview (Coming Soon)

- 🎯 Score entry for matches
- 🔄 Optimistic UI updates
- 🔔 Toast notifications
- 📥 Export to CSV/PDF
- 📱 Better mobile experience

**Phase 3:** Authentication, admin dashboard, tournament creation

---

## Quick Win: Test the App

```bash
# 1. Ensure both servers running
curl http://100.125.100.17:3000/health    # Backend
curl http://100.125.100.17:5173/          # Frontend

# 2. Open in browser
http://100.125.100.17:5173/

# 3. Test flow
Home → Click "Browse Tournaments" → Click a division → View standings/matches
```

---

## Help & Resources

**Documentation:**
- Full Overview: `/FRONTEND_TECHNICAL_OVERVIEW.md` (this guide's big brother)
- Health Check: `./health-check.sh`
- Remote Access: `/REMOTE_ACCESS.md`

**Need Help?**
- Check browser console (F12)
- Check React Query DevTools
- Read the error message carefully (TypeScript errors are usually clear)

---

## Remember

✅ Read-only viewer (Phase 1)
✅ Type-safe with strict TypeScript
✅ All server state via TanStack Query
✅ Material-UI for all UI components
✅ Responsive & accessible

**Last Updated:** October 15, 2025
**Access URL:** http://100.125.100.17:5173
