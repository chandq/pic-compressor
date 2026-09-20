import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: {
    esm: {},
    cjs: {},
    umd: {
      globalName: 'PicCompressor',
      minify: true,
      sourcemap: false
    }
  },
  dts: true,
  clean: true,
  fixedExtension: true,
  platform: 'browser',
  target: 'es2020',
  outDir: 'dist',
  outputOptions: {
    exports: 'named'
  }
});
