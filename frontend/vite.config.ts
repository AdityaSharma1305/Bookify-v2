import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: false, // Allow fallback to 5174, 5175 etc.
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        // Configure proxy response to strip WWW-Authenticate header
        // This prevents the browser native HTTP Basic auth popup
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            // Strip WWW-Authenticate header to prevent browser popup
            delete proxyRes.headers['www-authenticate'];
            delete proxyRes.headers['WWW-Authenticate'];
          });
        },
      },
    },
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react', 'recharts', 'zustand', 'axios', '@tanstack/react-query'],
        },
      },
    },
  },
});
