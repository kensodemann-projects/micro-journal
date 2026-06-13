import VueRouter from 'vue-router/vite';
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import Vue from '@vitejs/plugin-vue';
import Fonts from 'unplugin-fonts/vite';
import { configDefaults, defineConfig } from 'vitest/config';
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({ dts: 'src/typed-router.d.ts' }),
    tailwindcss(),
    Vue({
      template: { transformAssetUrls },
    }), // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    Fonts({
      fontsource: {
        families: [
          {
            name: 'Roboto Mono',
            weights: [400, 700],
          },
          {
            name: 'Roboto',
            weights: [100, 300, 400, 500, 700, 900],
            styles: ['normal', 'italic'],
          },
        ],
      },
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  server: {
    port: 3000,
  },
  test: {
    coverage: {
      provider: 'v8',
      exclude: [
        ...configDefaults.exclude,
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'package.json',
        'src/**/__mocks__',
        'src/models',
        'src/plugins',
        'src/router',
        'src/*.vue',
        'src/*.ts',
        'src/composables/firebase-app.ts',
      ],
    },
    clearMocks: true,
    env: {
      NODE_OPTIONS: '--localstorage-file=./vite-storage',
    },
    globals: true,
    environment: 'jsdom',
    server: {
      deps: {
        inline: ['vuetify'],
      },
    },
    setupFiles: './vitest.setup.ts',
  },
});
