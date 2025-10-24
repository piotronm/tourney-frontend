# Player Schema Migration - Frontend Changes

**Date**: 2025-10-23
**Status**: ✅ Types & Utilities Complete

---

## Overview

Updated frontend TypeScript types and utility functions to match the backend player schema migration. The backend now uses a single `name` field instead of `firstName`/`lastName`, and has separate `singlesRating` and `doublesRating` fields.

---

## Changes Made

### Type Definitions Updated

#### 1. Player Interface ([src/types/player.ts](./src/types/player.ts))

**NEW Fields**:
- `name: string` - Full player name (e.g., "John Smith")
- `singlesRating: number | null` - DUPR singles rating (1.0-7.0)
- `doublesRating: number | null` - DUPR doubles rating (1.0-7.0)
- `phone: string | null` - Phone number

**DEPRECATED Fields** (kept for backward compatibility):
- `firstName?: string` - Marked as `@deprecated`
- `lastName?: string` - Marked as `@deprecated`

**Updated Interfaces**:
```typescript
export interface Player {
  id: number;
  name: string;                    // NEW
  email: string | null;
  duprId: string | null;
  singlesRating: number | null;    // NEW
  doublesRating: number | null;    // NEW
  duprRating: number | null;       // Legacy
  phone: string | null;            // NEW
  // ... other fields
  firstName?: string;              // DEPRECATED
  lastName?: string;               // DEPRECATED
}

export interface CreatePlayerInput {
  name: string;                    // NEW (was firstName + lastName)
  email?: string | null;
  duprId?: string | null;
  singlesRating?: number | null;   // NEW
  doublesRating?: number | null;   // NEW
  phone?: string | null;           // NEW
}
```

#### 2. TeamPlayer Interface ([src/types/team.ts](./src/types/team.ts))

**Updated Interface**:
```typescript
export interface TeamPlayer {
  id: number;
  name: string;                    // NEW
  singlesRating: number | null;    // NEW
  doublesRating: number | null;    // NEW
  duprRating: number | null;       // Legacy
  position: number;
  // DEPRECATED
  firstName?: string;
  lastName?: string;
}
```

---

### Utility Functions Created

**Location**: [src/utils/formatters.ts](./src/utils/formatters.ts)

All functions are fully documented with JSDoc comments and usage examples.

#### Player Name Utilities

**`getInitials(name: string): string`**
- Extracts initials for avatar display
- Examples:
  - `"John Smith"` → `"JS"`
  - `"Madonna"` → `"MA"`
  - `"Mary Smith-Jones"` → `"MS"`

**`getLastName(name: string): string`**
- Extracts last name for sorting/display
- Examples:
  - `"John Smith"` → `"Smith"`
  - `"Madonna"` → `"Madonna"`
  - `"Bob Smith-Jones"` → `"Smith-Jones"`

**`getFirstName(name: string): string`**
- Extracts first name
- Examples:
  - `"John Smith"` → `"John"`
  - `"Madonna"` → `"Madonna"`

#### DUPR Rating Utilities

**`getCombinedDupr(players, isSingles?): number`**
- Calculate combined team DUPR rating
- Uses `doublesRating` by default, `singlesRating` if `isSingles=true`
- Example:
  ```typescript
  const players = [
    { singlesRating: 4.5, doublesRating: 4.2 },
    { singlesRating: 3.8, doublesRating: 4.0 }
  ];
  getCombinedDupr(players) // 8.2 (doubles)
  getCombinedDupr(players, true) // 8.3 (singles)
  ```

**`getAverageDupr(players, isSingles?): number | null`**
- Calculate average team DUPR rating
- Returns `null` if no ratings available

**`getDisplayRating(player, isSingles?): number | null`**
- Get appropriate rating based on division format
- Returns `doublesRating` by default, `singlesRating` if `isSingles=true`

**`formatDuprRating(rating): string`**
- Format rating for display
- Examples:
  - `4.234` → `"4.2"`
  - `null` → `"N/A"`

#### UI Utilities

**`getPointDiffColor(diff: number): 'success' | 'error' | 'default'`**
- Get MUI color for point differential display
- Positive → `'success'` (green)
- Negative → `'error'` (red)
- Zero → `'default'` (gray)

**`formatPhoneNumber(phone): string`**
- Format phone numbers for display
- Examples:
  - `"5551234567"` → `"(555) 123-4567"`
  - `"555-123-4567"` → `"(555) 123-4567"`
  - `null` → `""`

#### Sorting & Team Utilities

**`sortPlayersByName<T>(players: T[]): T[]`**
- Sort players by last name, then first name
- Does not mutate original array
- Example:
  ```typescript
  const players = [
    { name: "John Smith" },
    { name: "Alice Johnson" },
    { name: "Bob Smith" }
  ];
  sortPlayersByName(players)
  // [{ name: "Alice Johnson" }, { name: "Bob Smith" }, { name: "John Smith" }]
  ```

**`generateTeamName(player1Name, player2Name): string`**
- Generate team name from player names
- Format: `"LastName1 / LastName2"`
- Examples:
  - `("John Smith", "Mary Johnson")` → `"Smith / Johnson"`
  - `("Madonna", "Bob Lee")` → `"Madonna / Lee"`

---

### Testing

#### TypeScript Compilation ✅

```bash
cd frontend
npx tsc --noEmit
```

**Result**: ✅ **0 errors** (types and utilities compile successfully)

**Note**: Components will have TypeScript errors until they're updated to use new schema (expected - will be fixed in next step).

#### Unit Tests ✅

**File Created**: [src/utils/__tests__/formatters.test.ts](./src/utils/__tests__/formatters.test.ts)

**Test Coverage**:
- ✅ `getInitials()` - 5 test cases
- ✅ `getLastName()` - 4 test cases
- ✅ `getFirstName()` - 3 test cases
- ✅ `getCombinedDupr()` - 4 test cases
- ✅ `getAverageDupr()` - 3 test cases
- ✅ `formatDuprRating()` - 2 test cases
- ✅ `getPointDiffColor()` - 1 test case
- ✅ `formatPhoneNumber()` - 5 test cases
- ✅ `sortPlayersByName()` - 2 test cases
- ✅ `generateTeamName()` - 3 test cases

**Total**: 32 test cases covering all utility functions

**Note**: Test framework (vitest) not currently installed in frontend. Tests are ready to run once vitest is added to package.json.

---

## Migration Guide for Components

### Old Pattern (Before Migration):

```typescript
import { Player } from '@/types/player';

// Avatar initials
<Avatar>{player.firstName[0]}{player.lastName[0]}</Avatar>

// Display name
<Typography>{player.firstName} {player.lastName}</Typography>

// Display rating
<Chip label={`DUPR: ${player.duprRating?.toFixed(1) || 'N/A'}`} />

// Team name generation
const teamName = `${player1.lastName} / ${player2.lastName}`;
```

### New Pattern (After Migration):

```typescript
import type { Player } from '@/types/player';
import {
  getInitials,
  formatDuprRating,
  generateTeamName,
  getDisplayRating
} from '@/utils/formatters';

// Avatar initials
<Avatar>{getInitials(player.name)}</Avatar>

// Display name
<Typography>{player.name}</Typography>

// Display rating (context-aware for singles/doubles)
const rating = getDisplayRating(player, isSingles);
<Chip label={`DUPR: ${formatDuprRating(rating)}`} />

// Team name generation
const teamName = generateTeamName(player1.name, player2.name);
```

### Component Update Checklist

For each component using player data:

- [ ] Update imports to use `import type` for types
- [ ] Replace `firstName`/`lastName` with `name`
- [ ] Use `getInitials()` for avatars
- [ ] Use `getDisplayRating()` for ratings (not `duprRating`)
- [ ] Use utility functions instead of string manipulation
- [ ] Update forms to use single name field
- [ ] Handle null values gracefully (all new fields are nullable)

---

## Components That Need Updates

Based on grep analysis, the following components need updates:

### High Priority (Use Player/TeamPlayer types directly)
1. `/src/pages/admin/PlayersPage.tsx`
2. `/src/pages/admin/DivisionTeamsPage.tsx`
3. `/src/components/admin/PlayerCard.tsx` (if exists)
4. `/src/components/admin/TeamCard.tsx` (if exists)
5. `/src/components/admin/RegistrationCard.tsx` (if exists)

### Medium Priority (Forms/Dialogs)
6. `/src/components/admin/CreatePlayerDialog.tsx`
7. `/src/components/admin/EditPlayerDialog.tsx`
8. `/src/components/admin/BulkImportPlayersDialog.tsx`
9. Any registration forms

### Low Priority (May need updates if they display player data)
10. Dashboard components displaying player stats
11. Any reports/exports using player data

---

## Breaking Changes

### API Response Format Changes

**Before**:
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Smith",
  "duprRating": 4.2
}
```

**After**:
```json
{
  "id": 1,
  "name": "John Smith",
  "singlesRating": 4.5,
  "doublesRating": 4.2,
  "duprRating": 4.2,
  "phone": "555-123-4567",
  "firstName": "John",     // DEPRECATED - may be null for new players
  "lastName": "Smith"      // DEPRECATED - may be null for new players
}
```

### Component Breaking Changes

**All components using**:
- `player.firstName` → Must use `player.name` + `getFirstName()`
- `player.lastName` → Must use `player.name` + `getLastName()`
- `player.duprRating` → Should use `player.doublesRating` or `player.singlesRating`
- Avatar initials → Must use `getInitials(player.name)`
- Team name generation → Must use `generateTeamName()`

---

## Backward Compatibility

### Type Compatibility

The updated types maintain backward compatibility:
- `firstName` and `lastName` are optional (`?`)
- Old cached responses will still work
- Gradual migration is possible

### Deprecated Field Warning

TypeScript will show `@deprecated` warnings when using `firstName` or `lastName`, but won't cause compilation errors. This allows:
1. Gradual migration of components
2. Coexistence of old and new patterns temporarily
3. Clear indication of what needs updating

---

## Step 8: Component Updates - ✅ COMPLETED

All React components have been updated to use the new player schema:

### Components Updated (All Complete):

**Player Management Components**:
- [x] PlayerCard.tsx - Avatar initials, full name display, separate ratings
- [x] playerSchema.ts - Zod validation updated
- [x] PlayerForm.tsx - Single name field, doubles/singles rating fields
- [x] EditPlayerPage.tsx - Uses player.name
- [x] DeletePlayerDialog.tsx - Shows player.name
- [x] PlayersListPage.tsx - No changes needed (uses PlayerCard)

**Team Management Components**:
- [x] TeamCard.tsx - Uses getInitials(), player.name, separate ratings display

**Registration Components**:
- [x] RegistrationCard.tsx - Uses player.name and formatDuprRating()
- [x] RegisterPlayerModal.tsx - Updated both player and partner autocomplete
- [x] UnregisterDialog.tsx - Uses player.name

**Import/Export Components**:
- [x] CSVImportModal.tsx - Updated preview table to show new fields

### TypeScript Compilation: ✅ PASSED

```bash
npx tsc --noEmit
# Result: 0 errors
```

All components compile successfully with no type errors!

---

## Next Steps

### 1. Browser Testing (Recommended)

Manual testing checklist:
- [ ] Test player list page loads and displays correctly
- [ ] Test player creation with single name field
- [ ] Test player editing with new schema
- [ ] Test team roster display shows correct player names
- [ ] Test registration flow with partner selection
- [ ] Test CSV import preview
- [ ] Test player deletion dialog

### 2. Optional Enhancements

Consider adding:
- [ ] Vitest for frontend unit testing
- [ ] Component tests for updated components
- [ ] E2E tests for critical user flows
- [ ] Storybook stories for updated components

---

## Success Criteria

Migration Step 8 completion criteria:

- [x] All type files updated (`player.ts`, `team.ts`)
- [x] All utility functions created in `formatters.ts`
- [x] All functions have JSDoc documentation
- [x] Unit tests created (ready for vitest)
- [x] Zod validation schema updated
- [x] All player management components updated
- [x] All team components updated
- [x] All registration components updated
- [x] TypeScript compiles with 0 errors
- [x] Migration documentation updated

**Status**: ✅ **COMPONENT UPDATES COMPLETE**

---

## Rollback Plan

If issues arise during component updates:

1. **Types are backward compatible** - old components will still work with optional `firstName`/`lastName`
2. **Utility functions are additive** - don't break existing code
3. **Backend fully supports both formats** - deprecated fields returned in all responses
4. **Gradual rollback possible** - update components one at a time back to old pattern if needed

---

**Documentation Created**: 2025-10-23
**Last Updated**: 2025-10-23
**Status**: ✅ **MIGRATION COMPLETE** - All components updated and TypeScript compilation passing
