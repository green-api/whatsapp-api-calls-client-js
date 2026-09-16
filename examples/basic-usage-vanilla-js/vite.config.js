import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import tsconfigPaths from 'vite-tsconfig-paths';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    tsconfigPaths({
      projects: [resolve(__dirname, '../../tsconfig.json')],
    }),
  ],
  server: {
    host: true,
  },
  resolve: {
    alias: {
      '@green-api/whatsapp-api-calls-client-js': resolve(__dirname, '../../src/index.ts'),
    },
  },
});
