// vite.config.ts — FINAL & PERFECT
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 5174,
    host: true,
    strictPort: true,
    proxy: {
      '/api': 'http://127.0.0.1:8001',
      '/sanctum/csrf-cookie': 'http://127.0.0.1:8001',
    },
  },
});