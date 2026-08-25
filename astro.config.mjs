// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Deployed at https://momo-cafe.github.io — a user/org Pages site,
	// so it is served from the domain root and needs no `base`.
	site: 'https://momo-cafe.github.io',
});
