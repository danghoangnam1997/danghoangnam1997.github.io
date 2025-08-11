// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // --- THIS IS THE FIX ---
  // Set the base path for the production build.
  // This tells Vite to prepend all asset paths with your repository name.
  // Replace 'your-repo-name' with the actual name of your GitHub repository.
  base: '/danghoangnam1997.github.io/',

  plugins: [
    react(),
  ],

  // --- PATH ALIASES ---
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // --- BUILD OPTIMIZATIONS ---
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor_three';
            }
            if (id.includes('gsap')) {
              return 'vendor_gsap';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});
