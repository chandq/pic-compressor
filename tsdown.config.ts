import { createRequire } from 'node:module';
import { defineConfig } from 'tsdown';

interface PackageMetadata {
  name: string;
  version: string;
  license: string;
  homepage: string;
}

const require = createRequire(import.meta.url);
const packageMetadata = require('./package.json') as PackageMetadata;
const homepage = packageMetadata.homepage.replace(/#readme$/, '');
const banner = `/*! ${packageMetadata.name} v${packageMetadata.version} | ${packageMetadata.license} License | ${homepage} */`;

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
  banner: {
    js: banner
  },
  outputOptions: {
    exports: 'named'
  }
});
