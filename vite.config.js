// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],

  // --- PATH ALIASES ---
  // This allows us to use '@/' instead of '../../../' for imports.
  // It makes the codebase much cleaner and easier to refactor.
  // Example: import { Scene } from '@/components/scene/Scene';
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // --- BUILD OPTIMIZATIONS ---
  // These settings are crucial for a production build.
  build: {
    // Set a higher warning limit for chunk sizes (default is 500kb).
    // Three.js and other large libraries can easily exceed this.
    chunkSizeWarningLimit: 1000,

    // Configure Rollup for more fine-grained control over the output.
    rollupOptions: {
      output: {
        // This is a powerful optimization! It splits large third-party libraries
        // (like three, gsap, react) into their own chunks. This improves caching,
        // as users won't have to re-download these libraries every time you
        // change a single line in your own application code.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor_three';
            }
            if (id.includes('gsap')) {
              return 'vendor_gsap';
            }
            return 'vendor'; // All other node_modules
          }
        },
      },
    },
  },
});
