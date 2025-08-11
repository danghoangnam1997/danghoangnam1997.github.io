// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // base should be '/' for your username.github.io repo
  base: '/',

  plugins: [
    react(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // --- BUILD OPTIMIZATIONS (SIMPLIFIED AND MORE STABLE) ---
  build: {
    chunkSizeWarningLimit: 1600, // Increased limit for a single vendor chunk
    rollupOptions: {
      output: {
        // Group all node_modules into a single 'vendor' chunk.
        // This is more stable than creating multiple vendor chunks and prevents
        // the dependency loading errors we were seeing.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
