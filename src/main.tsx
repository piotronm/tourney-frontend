import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryConfigProvider } from '@/contexts/QueryConfigContext';
import { DevTools } from '@/components/DevTools';
import { router } from './router';
import { theme } from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Instant updates for admin operations (was: 30 * 1000)
      gcTime: 60 * 1000, // 1 minute garbage collection
      retry: 1,
      refetchOnWindowFocus: true, // Auto-refresh on window focus (was: false)
    },
  },
});

// Check localStorage for dev admin mode toggle
const isDevAdmin = import.meta.env.DEV && localStorage.getItem('dev_admin_mode') === 'true';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <QueryConfigProvider isAdmin={isDevAdmin}>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Toaster position="top-right" richColors />
            <RouterProvider router={router} />
            <DevTools />
            <ReactQueryDevtools initialIsOpen={false} />
          </ThemeProvider>
        </AuthProvider>
      </QueryConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
