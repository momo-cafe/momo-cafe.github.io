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

  integrations: [sitemap({ i18n: { defaultLocale: 'nl', locales: { nl: 'nl-NL', en: 'en' } } })],
});
