/*
 * The content loader.
 *
 * Sanity is the source of truth, read once at build time; src/content/*.json is
 * the fallback and stays in the repo as a working copy of the same shapes. The
 * two are interchangeable on purpose: whatever this module exports as `site`
 * and `menu` has exactly the shape src/content/site.json and
 * src/content/menu.json have, so components, t() and hours.js cannot tell the
 * difference and never had to change.
 *
 * Fallback happens when any of these is true:
 *   - MOMO_CONTENT=local is set (deliberate offline build, and what you want
 *     while editing the JSON directly)
 *   - @sanity/client is not installed
 *   - the query fails, times out, or the dataset has no usable documents yet
 *
 * Exactly one line is logged saying which source won.
 */
import localSite from '../content/site.json';
import localMenu from '../content/menu.json';
import { fetchContent, PROJECT_ID, DATASET } from './sanity.js';

/** A stalled CMS must not be able to hang a deploy. */
const FETCH_TIMEOUT_MS = 10_000;

function env(name) {
	const fromProcess = typeof process !== 'undefined' ? process.env?.[name] : undefined;
	if (fromProcess) return fromProcess;
	const viteEnv = import.meta.env;
	return viteEnv?.[name] ?? undefined;
}

async function load() {
	if (String(env('MOMO_CONTENT') ?? '').toLowerCase() === 'local') {
		return { site: localSite, menu: localMenu, source: 'local (MOMO_CONTENT=local)' };
	}

	let remote = null;
	try {
		remote = await Promise.race([
			fetchContent(),
			new Promise((resolve) => setTimeout(() => resolve(null), FETCH_TIMEOUT_MS)),
		]);
	} catch (error) {
		// fetchContent() is written not to throw; this is belt and braces.
		console.warn(`[content] Sanity fetch threw: ${error?.message ?? error}`);
	}

	if (remote) {
		return {
			site: remote.site,
			menu: remote.menu,
			source: `Sanity (project ${PROJECT_ID}, dataset ${DATASET})`,
		};
	}

	return { site: localSite, menu: localMenu, source: 'local JSON in src/content (Sanity unavailable or empty)' };
}

const loaded = await load();

console.log(`[content] source: ${loaded.source}`);

export const site = loaded.site;
export const menu = loaded.menu;
/** Which source won, for anything that wants to say so. */
export const CONTENT_SOURCE = loaded.source;

/**
 * Values in site.json that the owner still has to confirm are marked with the
 * string PLACEHOLDER. Anything user-facing has to be able to ask about that,
 * so it never renders "PLACEHOLDER: 8-digit KVK number" to a visitor.
 *
 * A field left empty in Sanity counts as a placeholder too, which is what makes
 * the pre-launch guards work identically against either source.
 */
export function isPlaceholder(value) {
	return typeof value !== 'string' || value.trim() === '' || value.includes('PLACEHOLDER');
}

/** The value, or null when it is still a placeholder. */
export function real(value) {
	return isPlaceholder(value) ? null : value;
}

export function fullAddress(business) {
	return `${business.street}, ${business.postcode} ${business.city}`;
}

/** Section 8: the address is a real link to both Google Maps and Apple Maps. */
export function mapLinks(business) {
	const query = encodeURIComponent(`${business.name}, ${fullAddress(business)}`);
	const { lat, lng } = business.coordinates;
	return {
		google: real(business.mapsUrl) ?? `https://www.google.com/maps/search/?api=1&query=${query}`,
		apple: `https://maps.apple.com/?q=${query}&ll=${lat},${lng}`,
	};
}
