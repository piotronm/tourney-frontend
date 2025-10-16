# Frontend Verification Checklist

Run through this checklist after fixing import errors.

## Pre-Flight Checks

- [x] `npm install` completed without errors
- [x] `npx tsc --noEmit` shows no errors
- [x] `npm run build` completes successfully
- [x] Backend is running at port 3000
- [x] Frontend dev server starts without errors

## Browser Checks

Open `http://100.125.100.17:5173` in browser:

### Home Page
- [ ] Page loads (no white screen)
- [ ] No console errors (red text)
- [ ] Hero section visible with Tournament Manager title
- [ ] "Browse Tournaments" button visible
- [ ] Button is clickable

### Divisions Page
- [ ] Clicking "Browse Tournaments" navigates to `/divisions`
- [ ] Search bar visible
- [ ] If divisions exist: Cards display with stats
- [ ] If no divisions: Empty state shows
- [ ] No console errors

### Division Detail Page (if division exists)
- [ ] Clicking a division card navigates to `/divisions/:id`
- [ ] Breadcrumbs show: Home > Tournaments > Division Name
- [ ] Tabs show: "Standings" and "Matches"
- [ ] Standings tab loads by default
- [ ] No console errors

### Standings Tab
- [ ] Standings table displays
- [ ] Pool name shown in header
- [ ] Teams ranked correctly
- [ ] All columns visible (Rank, Team, W, L, PF, PA, Diff)
- [ ] Point differential colored correctly (green/red)
- [ ] No console errors

### Matches Tab
- [ ] Clicking "Matches" tab shows matches
- [ ] Filter dropdowns visible (Pool, Status)
- [ ] Match cards display correctly
- [ ] BYE matches show correctly
- [ ] Completed matches show scores
- [ ] Pending matches show status
- [ ] No console errors

### Network Tab
- [ ] API calls to `/api/public/divisions` succeed (200)
- [ ] API calls to `/api/public/divisions/:id` succeed (200)
- [ ] API calls to `/api/public/divisions/:id/standings` succeed (200)
- [ ] API calls to `/api/public/divisions/:id/matches` succeed (200)
- [ ] No CORS errors
- [ ] No 404 or 500 errors

## Final Checks

- [ ] Navigate back to home page works
- [ ] Refresh page doesn't break anything
- [ ] All pages load within 2 seconds
- [ ] Mobile responsive (resize browser window)
- [ ] Console shows no errors on any page

## If Any Checks Fail

1. Check browser console for specific error
2. Refer to `BROWSER_DEBUGGING.md`
3. Run `./health-check.sh` again
4. Check backend logs
5. Verify CORS configuration

---

**All checks passed?** ✅ Frontend is working correctly!
