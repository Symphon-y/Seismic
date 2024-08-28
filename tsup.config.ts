import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['cjs', 'esm'],
  entryPoints: ['./src/index.ts'],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  clean: true,
  // minify: true,
  // splitting: true,
  external: [
    'react', // Externalize React to avoid bundling multiple instances
    'react-dom', // Externalize ReactDOM to avoid bundling multiple instances
    '@visx/xychart', // Externalize visx components
    '@visx/text', // Externalize visx text component
    '@visx/group', // Externalize visx group component
    '@visx/scale', // Externalize visx scale component
    '@emotion/styled', // Externalize emotion styled components
  ],
});
