// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://builtwest.ca',
  trailingSlash: 'ignore',
  integrations: [sitemap({ filter: (page) => !/\/(thanks|404)\/?$/.test(page) })],
});
