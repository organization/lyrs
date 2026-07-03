import { builtinModules } from 'node:module';
import { resolve } from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import {
  defineConfig,
  type MainViteConfig,
  type PreloadViteConfig,
  type RendererViteConfig,
} from 'electron-vite';
import { withFilter } from 'vite';
import solidPlugin from 'vite-plugin-solid';

const nodeBuiltins = [
  ...builtinModules,
  ...builtinModules.map((mod) => `node:${mod}`),
];

const nativeModules = [
  '@jellybrick/wql-process-monitor',
  '@asdf-overlay/core',
  'extract-file-icon',
  '@jellybrick/glasstron',
  'hmc-win32',
  'mica-electron',
];

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  const mainConfig: MainViteConfig = {
    build: {
      lib: {
        entry: 'index.ts',
        formats: ['es'],
      },
      outDir: 'dist/main',
      rolldownOptions: {
        external: ['electron', ...nativeModules, ...nodeBuiltins],
        input: './index.ts',
      },
      minify: !isDev,
      cssMinify: !isDev,
      sourcemap: isDev ? 'inline' : undefined,
      externalizeDeps: false,
    },
  };

  const preloadConfig: PreloadViteConfig = {
    build: {
      lib: {
        entry: 'src/preload.ts',
        formats: ['cjs'],
      },
      outDir: 'dist/preload',
      commonjsOptions: {
        ignoreDynamicRequires: true,
      },
      rolldownOptions: {
        external: ['electron', 'font-list', 'hmc-win32', ...nodeBuiltins],
        input: './src/preload.ts',
      },
      minify: !isDev,
      cssMinify: !isDev,
      sourcemap: isDev ? 'inline' : undefined,
      externalizeDeps: false,
    },
  };

  const rendererConfig: RendererViteConfig = {
    root: './renderer/',
    plugins: [
      tailwindcss(),
      withFilter(solidPlugin(), {
        load: { id: [/\.(tsx|jsx)$/, '/@solid-refresh'] },
      }),
    ],
    build: {
      outDir: 'dist/renderer',
      rolldownOptions: {
        input: {
          main: resolve(import.meta.dirname, 'renderer/main.html'),
          settings: resolve(import.meta.dirname, 'renderer/settings.html'),
          lyrics: resolve(import.meta.dirname, 'renderer/lyrics.html'),
          tray: resolve(import.meta.dirname, 'renderer/tray.html'),
        },
      },
      minify: !isDev,
      cssMinify: !isDev,
      sourcemap: isDev ? 'inline' : undefined,
    },
  };

  return {
    main: mainConfig,
    preload: preloadConfig,
    renderer: rendererConfig,
  };
});
