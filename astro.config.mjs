// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Served from the apex custom domain https://momo-cafe.nl, so the site
  // sits at the domain root and needs no `base`.
  site: 'https://momo-cafe.nl',

  integrations: [sitemap()],
});
