import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import manifest from './manifest.json';

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');
const appDir = resolve(srcDir, 'apps');

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: 'hidden',
  },
  resolve: {
    alias: {
      '@apps': appDir,
      '@background': resolve(appDir, 'background'),
      '@front': resolve(appDir, 'front'),
      '@assets': resolve(srcDir, 'assets'),
      '@src': srcDir,
    },
  },
  plugins: [
    react(),
    crx({ manifest }),
    sentryVitePlugin({
      org: 'j2i5ll',
      project: 'hoyoverse-check-in',
      authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
      release: {
        name: manifest.version,
      },
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          'global-builtin',
          'legacy-js-api',
          'color-functions',
          'import',
        ],
      },
    },
  },
});
