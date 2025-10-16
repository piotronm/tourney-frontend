import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, // Listen on all addresses (0.0.0.0)
    port: 5173,
    strictPort: true,
    allowedHosts: [
      'bracketiq.win',
      'api.bracketiq.win',
      '100.125.100.17',
      'localhost',
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
