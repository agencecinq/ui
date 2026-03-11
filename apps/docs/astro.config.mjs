// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://agencecinq.github.io',
  base: '/ui/',
  integrations: [
    starlight({
      title: 'CINQ UI',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/agencecinq/ui' },
      ],
      customCss: ['./src/styles/global.css'],
      sidebar: [
        { label: 'Getting started', items: [{ label: 'Overview', slug: '' }] },
        {
          label: 'Components',
          items: [
            { label: 'Tabs', slug: 'components/tabs' },
            { label: 'Modal', slug: 'components/modal' },
            { label: 'Drawer', slug: 'components/drawer' },
          ],
        },
      ],
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        allow: ['../..'],
      },
    },
  },
});