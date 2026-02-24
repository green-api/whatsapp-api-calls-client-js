import { defineConfig } from 'vite';
import { resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  envDir: resolve(__dirname, '..'), // грузим .env из корня проекта
  plugins: [
    tsconfigPaths({
      projects: [resolve(__dirname, '../tsconfig.json')],
    }),
  ],
  resolve: {
    alias: {
      '@green-api/whatsapp-api-calls-client-js': resolve(__dirname, '../src/index.ts'),
    },
  },
});
