import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
// Папку с .env можно задать через переменную: ENV_DIR=./my-env vite
export default defineConfig({
  envDir: process.env.ENV_DIR || undefined, // по умолчанию — корень проекта
  plugins: [
    tsconfigPaths(),
    dts({
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'GreenApiVoipClient',
      fileName: 'build',
    },
    outDir: 'lib',
  },
});
