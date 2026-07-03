import { builtinModules } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  defineConfig,
  type MainViteConfig,
  type PreloadViteConfig,
  type RendererViteConfig,
} from 'electron-vite';
import { withFilter } from 'vite';
import solidPlugin from 'vite-plugin-solid';

const __dirname = dirname(fileURLToPath(import.meta.url));

const nodeBuiltins = [
  ...builtinModules,
  ...builtinModules.map((mod) => `node:${mod}`),
];

const nativeModules = [
  '@alexssmusica/ffi-napi',
  '@alexssmusica/ref-napi',
  '@jellybrick/wql-process-monitor',
  'asdf-overlay-node',
  'extract-file-icon',
  'glasstron',
  'hmc-win32',
  'mica-electron',
  'node-window-manager',
];

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  const mainConfig: MainViteConfig = {
    build: {
      lib: {
        entry: 'index.ts',
        formats: ['cjs'],
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
      withFilter(solidPlugin(), {
        load: { id: [/\.(tsx|jsx)$/, '/@solid-refresh'] },
      }),
    ],
    build: {
      outDir: 'dist/renderer',
      rolldownOptions: {
        input: {
          main: resolve(__dirname, 'renderer/main.html'),
          settings: resolve(__dirname, 'renderer/settings.html'),
          lyrics: resolve(__dirname, 'renderer/lyrics.html'),
          tray: resolve(__dirname, 'renderer/tray.html'),
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
