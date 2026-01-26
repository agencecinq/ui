import { Plugin } from 'vite';
import fs from 'fs-extra';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Cette syntaxe remplace __dirname dans les modules ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function cinqDrawerPlugin(): Plugin {
  return {
    name: 'vite-plugin-cinq-drawer',

    async buildStart() {
      // Une fois publié, le plugin est dans dist/
      // On cherche donc le fichier liquid à côté ou un cran au dessus
      const source = resolve(__dirname, '../src/drawer.liquid'); 
      const destination = resolve(process.cwd(), 'snippets/cinq-drawer.liquid');

      try {
        if (await fs.pathExists(source)) {
          await fs.ensureDir(dirname(destination)); // Sécurité : crée snippets/ si absent
          await fs.copy(source, destination);
            console.log('✅ CINQ : Liquid snippet copied.');
        }
      } catch (err) {
        console.error('❌ CINQ : Copying error :', err);
      }
    },

    async handleHotUpdate({ file, server }) {
      if (file.endsWith('drawer.liquid')) {
        const destination = resolve(process.cwd(), 'snippets/cinq-drawer.html.liquid');
        await fs.copy(file, destination);
        server.ws.send({ type: 'full-reload' });
      }
    }
  };
}