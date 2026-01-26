import fs from 'fs';
import path from 'path';
import { Plugin } from 'vite';

interface ShopifyLiquidConfig {
  themeRoot: string;
  sourceFile?: string;
}

export default function shopifyLiquid(config: ShopifyLiquidConfig): Plugin {
  const sourcePath = config.sourceFile || path.resolve(__dirname, 'src/drawer.liquid');
  const targetPath = path.resolve(config.themeRoot, 'snippets/cinq-drawer.liquid');

  const copyFile = () => {
    try {
      if (fs.existsSync(sourcePath)) {
        // Crée le dossier snippets s'il n'existe pas
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`\x1b[32m ✓ \x1b[0m Liquid snippet synced: ${path.basename(targetPath)}`);
      }
    } catch (err) {
      console.error(`\x1b[31m ✗ \x1b[0m Error syncing Liquid snippet:`, err);
    }
  };

  return {
    name: 'vite-plugin-shopify-liquid',

    // Exécuté à la fin de chaque build (y compris en mode --watch)
    closeBundle() {
      copyFile();
    },

    // Exécuté lors d'un changement de fichier en mode dev
    handleHotUpdate({ file }) {
      if (file.endsWith('.liquid')) {
        copyFile();
      }
    }
  };
}