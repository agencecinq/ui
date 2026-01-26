import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        plugin: resolve(__dirname, 'src/plugin.ts')
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`
    },
    rollupOptions: {
      external: [
        'vite',
        'fs-extra',
        'node:path',
        'node:url',
        'node:fs',
        'path',
        'url',
        'fs'
      ],
      output: {
        globals: {
          vite: 'Vite',
          'fs-extra': 'fsExtra',
          path: 'path'
        }
      }
    },
  },
  plugins: [
    dts(),
  ],
});
