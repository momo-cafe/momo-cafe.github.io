// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Served from the apex custom domain https://momo-cafe.nl, so the site
  // sits at the domain root and needs no `base`.
  site: 'https://momo-cafe.nl',

  // Dutch is the default and lives at /, English at /en/.
  i18n: {
    defaultLocale: 'nl',
    locales: ['nl', 'en'],
    routing: { prefixDefaultLocale: false },
  },

  image: {
    // Gallery photos uploaded in the studio are served from Sanity's CDN.
    // Allowlisting it lets Astro download and re-encode them at build time, so
    // visitors get AVIF and WebP from momo-cafe.nl and the site keeps working
    // if Sanity is down: the images are already baked into the artifact.
    domains: ['cdn.sanity.io'],
  },

  integrations: [sitemap({ i18n: { defaultLocale: 'nl', locales: { nl: 'nl-NL', en: 'en' } } })],
});
