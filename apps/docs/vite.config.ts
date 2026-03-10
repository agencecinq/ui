import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/shopify/',
  server: {
    port: 5173,
    fs: {
      allow: ['../..']
    }
  },
  resolve: {
    alias: {
      '@agencecinq/utils': resolve(__dirname, '../../packages/utils/src/index.ts'),
      '@agencecinq/drawer': resolve(__dirname, '../../packages/drawer/src/index.ts'),
      '@agencecinq/modal': resolve(__dirname, '../../packages/modal/src/index.ts'),
      '@agencecinq/tabs': resolve(__dirname, '../../packages/tabs/src/index.ts')
    }
  }
});