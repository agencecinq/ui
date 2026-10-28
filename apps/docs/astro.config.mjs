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
      components: {
        SiteTitle: './src/components/SiteTitle.astro',
        Footer: './src/components/Footer.astro',
      },
      sidebar: [
        { label: 'Getting started', items: [{ label: 'Overview', slug: '' }] },
        {
          label: 'Components',
          items: [
            { label: 'Tabs', slug: 'components/tabs' },
            { label: 'Modal', slug: 'components/modal' },
            { label: 'Drawer', slug: 'components/drawer' },
            { label: 'Sheet', slug: 'components/sheet' },
            { label: 'Spinbutton', slug: 'components/spinbutton' },
            { label: 'Slider', slug: 'components/slider' },
            { label: 'Disclosure Button', slug: 'components/disclosure-button' },
            { label: 'Disclosure Navigation', slug: 'components/disclosure-navigation' },
            { label: 'Drilldown', slug: 'components/drilldown' },
            { label: 'Dropzone', slug: 'components/dropzone' },
            { label: 'Switch', slug: 'components/switch' },
            { label: 'Toast', slug: 'components/toast' },
            { label: 'Accordion', slug: 'components/accordion' },
            { label: 'Combobox', slug: 'components/combobox' },
            { label: 'Window Splitter', slug: 'components/windowsplitter' },
            { label: 'Calendar', slug: 'components/calendar' },
            { label: 'Snake', slug: 'components/snake' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Utils', slug: 'reference/utils' },
            { label: 'Store', slug: 'reference/store' },
          ],
        },
        {
          label: 'Sandbox',
          items: [
            { label: 'Overview', slug: 'sandbox' },
            { label: 'Pixelate', slug: 'sandbox/pixelate' },
            { label: 'Dual scroll', slug: 'sandbox/dual-scroll' },
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