import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts'; 
import shopifyLiquid from './vite-plugin-shopify-liquid';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'Drawer',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['@agencecinq/utils']
    }
  },
    plugins: [
        dts(),
        shopifyLiquid({
      // Chemin vers votre thème Shopify local
      themeRoot: path.resolve(__dirname, '../../../votre-theme-shopify')
    })
    ]
});