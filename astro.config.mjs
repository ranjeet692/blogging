import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { site } from './src/site.config.ts';

export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/404') })],
  markdown: {
    shikiConfig: {
      themes: { light: 'min-light', dark: 'min-dark' },
      wrap: false,
    },
  },
});
