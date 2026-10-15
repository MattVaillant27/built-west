// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';

// Self-hosted fonts via Astro's font API. It generates metric-matched fallback faces,
// so text doesn't shift when the real fonts arrive (no need to preload the heavy serif).
const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIN_EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';

export default defineConfig({
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Source Serif 4',
      cssVariable: '--font-serif',
      fallbacks: ['serif'],
      options: {
        variants: [
        { src: ['./src/assets/fonts/source-serif-4-latin-opsz-normal.woff2'], weight: '200 900', style: 'normal', display: 'swap', unicodeRange: [LATIN] },
        { src: ['./src/assets/fonts/source-serif-4-latin-ext-opsz-normal.woff2'], weight: '200 900', style: 'normal', display: 'swap', unicodeRange: [LATIN_EXT] },
        { src: ['./src/assets/fonts/source-serif-4-latin-opsz-italic.woff2'], weight: '200 900', style: 'italic', display: 'swap', unicodeRange: [LATIN] },
        { src: ['./src/assets/fonts/source-serif-4-latin-ext-opsz-italic.woff2'], weight: '200 900', style: 'italic', display: 'swap', unicodeRange: [LATIN_EXT] },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Montserrat',
      cssVariable: '--font-montserrat',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
        { src: ['./src/assets/fonts/montserrat-latin-400-normal.woff2'], weight: '400', style: 'normal', display: 'swap', unicodeRange: [LATIN] },
        { src: ['./src/assets/fonts/montserrat-latin-ext-400-normal.woff2'], weight: '400', style: 'normal', display: 'swap', unicodeRange: [LATIN_EXT] },
        { src: ['./src/assets/fonts/montserrat-latin-500-normal.woff2'], weight: '500', style: 'normal', display: 'swap', unicodeRange: [LATIN] },
        { src: ['./src/assets/fonts/montserrat-latin-ext-500-normal.woff2'], weight: '500', style: 'normal', display: 'swap', unicodeRange: [LATIN_EXT] },
        { src: ['./src/assets/fonts/montserrat-latin-600-normal.woff2'], weight: '600', style: 'normal', display: 'swap', unicodeRange: [LATIN] },
        { src: ['./src/assets/fonts/montserrat-latin-ext-600-normal.woff2'], weight: '600', style: 'normal', display: 'swap', unicodeRange: [LATIN_EXT] },
        { src: ['./src/assets/fonts/montserrat-latin-700-normal.woff2'], weight: '700', style: 'normal', display: 'swap', unicodeRange: [LATIN] },
        { src: ['./src/assets/fonts/montserrat-latin-ext-700-normal.woff2'], weight: '700', style: 'normal', display: 'swap', unicodeRange: [LATIN_EXT] },
        ],
      },
    },
  ],
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
