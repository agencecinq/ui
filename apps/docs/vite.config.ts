import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 5173,
    fs: {
      // Autorise l'accès au reste du monorepo
      allow: ['../..']
    }
  },
  resolve: {
    alias: {
      // Permet d'utiliser les noms de packages CINQ au lieu des chemins relatifs
      '@agencecinq/utils': resolve(__dirname, '../../packages/utils/src/index.ts'),
      '@agencecinq/c-drawer': resolve(__dirname, '../../packages/c-drawer/src/index.ts')
    }
  }
});