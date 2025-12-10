import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/build/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    // (опционально) если нужен HMR через Docker:
    hmr: {
      host: 'localhost',
      port: 5173,
    },
  },
  build: {
    outDir: resolve(__dirname, '../backend/public/build'),
    emptyOutDir: true,
    manifest: true,
    manifestDir: '.',
    rollupOptions: {
      input: resolve(__dirname, 'src/index.jsx'),
    },
  },
});