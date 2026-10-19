import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.{test,spec}.ts', 'src/**/*.{test,spec}.ts'],
    exclude: ['tests/**/*.spec.ts', 'node_modules', '.next'],
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
});
