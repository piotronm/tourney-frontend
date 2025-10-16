# Tournament Frontend

React + TypeScript + Material-UI frontend for tournament management.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **TanStack Query** - Data fetching
- **Axios** - HTTP client

## Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# Open http://localhost:5173

# Build for production
npm run build
```

## Environment Variables

Create `.env.development`:

```bash
VITE_API_BASE_URL=http://localhost:3000/api/public
```

## Features (Phase 1)

- ✅ Browse tournaments
- ✅ Search divisions
- ✅ View standings
- ✅ View match schedules
- ✅ Filter matches by pool/status
- ✅ Real-time data with auto-refresh

## Project Structure

```
src/
├── api/            # API client & types
├── components/     # React components
├── hooks/          # Custom hooks
├── pages/          # Page components
├── utils/          # Utilities
├── theme.ts        # MUI theme
├── router.tsx      # Routes
└── main.tsx        # Entry point
```
