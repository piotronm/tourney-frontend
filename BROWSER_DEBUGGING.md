# Browser Debugging Guide

When the frontend loads with a white screen, check the browser console for errors.

## Common Errors and Fixes

### Error 1: Module Import Error
```
Uncaught SyntaxError: The requested module '/src/api/types.ts' does not provide an export named 'Match'
```

**Fix:**
1. Open `src/api/types.ts`
2. Verify `export interface Match { ... }` exists
3. Restart dev server: `Ctrl+C`, then `npm run dev`

---

### Error 2: 404 on Module
```
Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/html"
```

**Fix:**
1. Check if file exists at the path shown
2. Verify import path uses `@/` not `../../`
3. Clear browser cache (Ctrl+Shift+R)

---

### Error 3: React Hook Error
```
Uncaught Error: Invalid hook call
```

**Fix:**
1. Check React version: `npm list react`
2. Ensure only one React instance: `npm dedupe`
3. Restart dev server

---

### Error 4: CORS Error
```
Access to fetch at 'http://100.125.100.17:3000/api/public/divisions' from origin 'http://100.125.100.17:5173' has been blocked by CORS policy
```

**Fix:**
1. Check backend CORS config includes: `http://100.125.100.17:5173`
2. Restart backend server
3. Verify backend is running: `curl http://100.125.100.17:3000/health`

---

### Error 5: API Connection Error
```
Network Error
```

**Fix:**
1. Check backend is running: `curl http://100.125.100.17:3000/health`
2. Check `.env.development` has correct API URL
3. Check Tailscale connection: `tailscale status`

---

## Debugging Steps

### 1. Open Browser DevTools

- **Windows:** F12 or Ctrl+Shift+I
- **Mac:** Cmd+Option+I

### 2. Check Console Tab

- Red errors = breaking issues
- Yellow warnings = non-critical issues

### 3. Check Network Tab

- Failed requests (red) = API connection issues
- 404 = wrong URL
- 500 = backend error
- CORS error = CORS misconfiguration

### 4. Check Sources Tab

- Verify files are loading
- Set breakpoints to debug

## Quick Checks

```bash
# Backend running?
curl http://100.125.100.17:3000/health

# Backend API working?
curl http://100.125.100.17:3000/api/public/divisions

# Frontend building?
npm run build

# TypeScript errors?
npx tsc --noEmit
```
