// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';

export default defineConfig({
  site: 'https://builtwest.ca',
  trailingSlash: 'ignore',
  // Public pages stay static; only /crm renders on demand (Netlify Functions).
  adapter: netlify({
    imageCDN: false,
    // We don't use edge functions; their local emulator needs Deno and errors in `astro dev`.
    devFeatures: { edgeFunctions: false, images: false, environmentVariables: false },
  }),
  integrations: [sitemap({ filter: (page) => !/\/(thanks|404)\/?$/.test(page) && !page.includes('/crm') })],
});
