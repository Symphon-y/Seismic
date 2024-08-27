import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: ['./src/index.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  sourcemap: true,
  clean: true,
  minify: true,
  splitting: true,
  external: ['react', 'react-dom'],
});
