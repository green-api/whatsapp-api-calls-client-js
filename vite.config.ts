import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
// The .env directory can be set through a variable: ENV_DIR=./my-env vite
export default defineConfig({
  envDir: process.env.ENV_DIR || undefined, // the project root by default
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
