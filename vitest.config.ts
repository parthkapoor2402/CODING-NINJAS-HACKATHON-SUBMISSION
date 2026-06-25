import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  test: {
    env: {
      VITE_AI_GATEWAY_ENABLED: 'false',
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: [
      'src/**/*.{test,spec}.{ts,tsx}',
      'src/**/*.integration.test.{ts,tsx}',
      'server/**/*.test.ts',
    ],
    exclude: ['**/node_modules/**', 'src/test/e2e/**'],
    testTimeout: 15_000,
  },
});
