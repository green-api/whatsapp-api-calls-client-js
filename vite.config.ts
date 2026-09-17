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
      // One self-contained `lib/index.d.ts` instead of a tree of files that reference each
      // other. The option was called `rollupTypes` before vite-plugin-dts 5; the old name is
      // accepted silently and does nothing, which is how a barrel ends up shipped by mistake.
      bundleTypes: true,
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
