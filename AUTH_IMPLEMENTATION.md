# Authentication System Documentation

## Overview
This frontend implements Google OAuth authentication that integrates with the backend session-based auth system.

## Architecture

### Components
- **AuthContext** ([src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx)) - Global auth state
- **LoginPage** ([src/pages/LoginPage.tsx](src/pages/LoginPage.tsx)) - Google OAuth login UI
- **ProtectedRoute** ([src/components/auth/ProtectedRoute.tsx](src/components/auth/ProtectedRoute.tsx)) - Route guard
- **UnauthorizedPage** ([src/pages/UnauthorizedPage.tsx](src/pages/UnauthorizedPage.tsx)) - Access denied page
- **AdminLayout** ([src/components/admin/AdminLayout.tsx](src/components/admin/AdminLayout.tsx)) - Admin panel layout
- **DashboardPage** ([src/pages/admin/DashboardPage.tsx](src/pages/admin/DashboardPage.tsx)) - Admin dashboard

### API Integration
- **GET /api/auth/me** - Check current session
- **POST /api/auth/logout** - Clear session
- **GET /api/auth/google** - Start OAuth flow (redirects to Google)
- **GET /api/auth/google/callback** - OAuth callback handler (redirects to frontend)

## How It Works

### Login Flow
1. User clicks "Sign in with Google"
2. Frontend redirects to `http://100.125.100.17:3000/api/auth/google`
3. Backend redirects to Google OAuth consent screen
4. User signs in with Google and grants consent
5. Google redirects to `http://100.125.100.17:3000/api/auth/google/callback`
6. Backend creates session, sets cookie, redirects to `http://100.125.100.17:5173/admin/dashboard`
7. Frontend loads dashboard and checks session with `GET /api/auth/me`

### Session Persistence
- Backend sets `tournament_session` cookie (httpOnly, secure in production)
- Cookie sent automatically with all API requests (`withCredentials: true`)
- Frontend calls `GET /api/auth/me` on app load to restore session
- Session persists across page refreshes and browser tabs

### Logout Flow
1. User clicks "Logout" in header menu
2. Frontend calls `POST /api/auth/logout`
3. Backend clears session cookie
4. Frontend clears user state and redirects to home page

### Protected Routes
- `ProtectedRoute` component wraps admin routes
- Checks `isAuthenticated` from `AuthContext`
- Shows loading spinner while checking session
- Redirects to `/login` if not authenticated
- Redirects to `/unauthorized` if not admin (when `requireAdmin=true`)

## Security Features
- HttpOnly cookies (JavaScript can't access)
- Secure flag in production (HTTPS only)
- CSRF protection via SameSite cookie attribute
- 401 errors automatically redirect to login
- Session expiration handled by backend

## File Structure

```
src/
├── api/
│   ├── auth.ts              # Auth API client (getCurrentUser, logout, initiateGoogleLogin)
│   └── client.ts            # Axios client with withCredentials: true
├── components/
│   ├── admin/
│   │   └── AdminLayout.tsx  # Admin panel layout with sidebar
│   ├── auth/
│   │   └── ProtectedRoute.tsx  # Route guard component
│   └── layout/
│       └── Header.tsx       # Updated with auth UI (avatar, menu, login button)
├── contexts/
│   └── AuthContext.tsx      # Auth provider and useAuth hook
├── pages/
│   ├── admin/
│   │   └── DashboardPage.tsx  # Admin dashboard (placeholder)
│   ├── LoginPage.tsx        # Google OAuth login page
│   └── UnauthorizedPage.tsx # Access denied page
├── types/
│   └── auth.ts              # TypeScript interfaces (User, AuthState, etc.)
├── router.tsx               # Updated with auth routes
└── main.tsx                 # Wrapped with AuthProvider
```

## Route Structure

```
/                           → Public (HomePage)
/divisions                  → Public (DivisionsPage)
/divisions/:id/standings    → Public (StandingsPage)
/divisions/:id/matches      → Public (MatchesPage)
/login                      → Public (LoginPage)
/unauthorized               → Public (UnauthorizedPage)
/admin                      → Protected (redirects to /admin/dashboard)
  /admin/dashboard          → Protected (DashboardPage)
```

## Testing Checklist

### Initial State
- [ ] Visit `http://100.125.100.17:5173/`
- [ ] Header shows "Sign In" button
- [ ] Visit `/admin/dashboard` → Redirects to `/login`

### Login Flow
- [ ] Click "Sign In" button in header OR visit `/login`
- [ ] Click "Sign in with Google" button
- [ ] Browser redirects to Google OAuth consent screen
- [ ] Sign in with Google account
- [ ] After consent, redirects back to frontend
- [ ] Should land on `/admin/dashboard`
- [ ] Header shows user avatar (not "Sign In" button)

### Authenticated State
- [ ] Click user avatar in header → Menu opens
- [ ] Menu shows: name, email, "Admin Dashboard" link, "Logout" button
- [ ] Click "Admin Dashboard" → Navigates to `/admin/dashboard`
- [ ] Dashboard shows welcome message with user name
- [ ] Sidebar shows "Admin Panel" and menu items

### Protected Routes
- [ ] As authenticated user, can access `/admin/dashboard`
- [ ] As authenticated user, sidebar navigation works
- [ ] Open new tab, visit `/admin/dashboard` → Session persists (no re-login needed)

### Logout Flow
- [ ] Click avatar → Click "Logout"
- [ ] Redirects to home page (`/`)
- [ ] Header shows "Sign In" button again (not avatar)
- [ ] Visit `/admin/dashboard` → Redirects to `/login`

### Error Handling
- [ ] Simulate network error (disconnect internet)
- [ ] Try to access `/admin/dashboard` → Shows loading, then redirects to login (when connection restored)
- [ ] Visit `/login?error=auth_failed` → Error message displays

### Edge Cases
- [ ] Refresh page while logged in → Session persists
- [ ] Open in new tab while logged in → Already authenticated
- [ ] Open in incognito/private window → Not logged in (as expected)
- [ ] Log in with non-admin user (if available) → Can log in but can't access admin routes (redirects to `/unauthorized`)

## Troubleshooting

### Issue: Redirects to login on every page
**Symptoms:** User gets logged in but immediately redirected back to login on protected routes

**Possible Causes:**
- `withCredentials: true` not set in axios config
- Backend CORS not allowing credentials
- Browser blocking cookies

**Solution:**
1. Check [src/api/client.ts:12](src/api/client.ts#L12) has `withCredentials: true`
2. Verify backend CORS allows credentials (see backend CORS_CONFIG.md)
3. Check browser console for cookie errors
4. Verify cookie is set in Application tab → Cookies

### Issue: "Not authorized" even after login
**Symptoms:** User can log in but gets redirected to `/unauthorized`

**Possible Causes:**
- User role in database is not ADMIN
- `requireAdmin` prop incorrectly set

**Solution:**
1. Check user role: Query backend database for user's role
2. Verify [src/router.tsx:60](src/router.tsx#L60) has correct `requireAdmin` value
3. Check backend `/api/auth/me` returns correct role in response

### Issue: OAuth redirects to wrong URL
**Symptoms:** After Google OAuth, redirected to localhost or wrong domain

**Possible Causes:**
- Google OAuth redirect URI misconfigured
- Backend redirect URL incorrect

**Solution:**
1. Verify Google OAuth redirect URI: `http://100.125.100.17:3000/api/auth/google/callback`
2. Check backend redirect after callback: `http://100.125.100.17:5173/admin/dashboard`
3. Update Google Cloud Console OAuth settings if needed

### Issue: Cookie not being sent with requests
**Symptoms:** Network tab shows requests without cookies

**Possible Causes:**
- `withCredentials: true` missing
- CORS not configured for credentials
- Cookie domain mismatch

**Solution:**
1. Verify [src/api/client.ts:12](src/api/client.ts#L12) has `withCredentials: true`
2. Check backend CORS allows origin and credentials
3. Verify backend and frontend on same domain (or proper CORS setup)

### Issue: Session not persisting after refresh
**Symptoms:** User has to log in again after refreshing page

**Possible Causes:**
- Cookie expiration too short
- Cookie not set as persistent
- Session storage issue on backend

**Solution:**
1. Check cookie expiration in Application tab → Cookies
2. Verify backend sets cookie with appropriate maxAge
3. Check backend session storage (Redis, database, etc.) is working

## Environment Variables

Required in [.env.development](.env.development):

```bash
VITE_API_BASE_URL=http://100.125.100.17:3000/api/public
```

The auth endpoints strip `/api/public` to use the base URL for OAuth routes.

## Code Quality

### TypeScript
- Zero TypeScript errors
- All components fully typed
- No `any` types used
- Proper use of `import type` for type imports

### ESLint
- Zero ESLint errors
- All warnings addressed
- Proper use of hooks (no dependency warnings)

### Best Practices
- Centralized auth state management
- Proper error handling
- Loading states for async operations
- Accessibility features (ARIA labels, keyboard navigation)
- Responsive design

## Future Enhancements

### Planned Features
- [ ] Remember me (longer session duration)
- [ ] Two-factor authentication
- [ ] Role-based UI (show/hide features based on role)
- [ ] Session timeout warning
- [ ] Multiple OAuth providers (GitHub, Microsoft, etc.)
- [ ] User profile management
- [ ] Email verification

### Phase 2 and Beyond
After Phase 1 authentication is complete, the following phases will build on this foundation:

- **Phase 2:** Division Management (Create, Edit, Delete tournaments)
- **Phase 3:** Team Management (Add teams, CSV import)
- **Phase 4:** Pool & Match Generation
- **Phase 5:** Score Entry & Live Updates

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify backend is running: `curl http://100.125.100.17:3000/health`
3. Check browser console for errors
4. Verify cookies are being set (Application tab in DevTools)
5. Review the testing checklist above

## Completed Implementation

✅ All 15 tasks completed:
1. ✅ TypeScript interfaces created
2. ✅ Auth API client created
3. ✅ Axios client updated with withCredentials
4. ✅ AuthContext and Provider created
5. ✅ App wrapped with AuthProvider
6. ✅ Login page created
7. ✅ ProtectedRoute component created
8. ✅ Unauthorized page created
9. ✅ Header updated with auth UI
10. ✅ AdminLayout component created
11. ✅ Admin Dashboard page created
12. ✅ Router configuration updated
13. ✅ Environment variables verified
14. ✅ TypeScript and ESLint checks passed
15. ✅ Documentation created

**Phase 1 authentication system is now complete and ready for testing!**
