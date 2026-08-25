/**
 * The localisation seam.
 *
 * Every translatable value in src/content/*.json is shaped { nl, en }. Nothing
 * outside this file may index into a locale key directly: when the content
 * moves to Sanity, only this function and the loaders change.
 */
export function t(field, locale) {
	return field?.[locale] ?? field?.nl ?? '';
}

/** Fill {name} slots in a translated string. */
export function fill(str, vars) {
	return String(str).replace(/\{(\w+)\}/g, (m, key) => (key in vars ? String(vars[key]) : m));
}

export const LOCALES = ['nl', 'en'];
export const DEFAULT_LOCALE = 'nl';

/**
 * Path for a page in a given locale. The default locale is unprefixed, which
 * matches `routing.prefixDefaultLocale: false` in astro.config.mjs.
 * `page` is '' for the home page, or a slug like 'privacy'.
 */
export function localePath(locale, page = '') {
	const prefix = locale === DEFAULT_LOCALE ? '/' : `/${locale}/`;
	return page ? `${prefix}${page}/` : prefix;
}

/** The other locale, for the toggle. */
export function otherLocale(locale) {
	return locale === 'nl' ? 'en' : 'nl';
}
