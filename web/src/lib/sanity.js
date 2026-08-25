/*
 * Sanity, at build time only.
 *
 * The site is statically built, so this module runs on the machine doing the
 * build and never in a visitor's browser. Its whole job is to fetch the two
 * singleton documents and hand back objects shaped EXACTLY like
 * src/content/site.json and src/content/menu.json. Everything downstream
 * (src/components, src/lib/t.js, src/lib/hours.js) keeps reading the same
 * shapes it always did, which is why none of it had to change.
 *
 * If anything at all goes wrong here we return null and src/lib/content.js
 * falls back to the local JSON. A CMS outage must not be able to break a build.
 */

export const PROJECT_ID = 'drw50awd';
export const DATASET = 'production';
/** Pinned: an unpinned apiVersion means the API can change under the build. */
export const API_VERSION = '2026-08-01';

/** Fixed document ids, shared with scripts/seed-sanity.mjs. */
export const SITE_DOC_ID = 'siteSettings';
export const MENU_DOC_ID = 'menu';

/** Monday first, matching DAY_KEYS in src/lib/hours.js. */
const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

/** Every key site.json's `ui` block carries. */
const UI_KEYS = [
	'skip',
	'languageLabel',
	'routeCta',
	'menuCta',
	'hoursHeading',
	'closedDay',
	'today',
	'whereHeading',
	'menuHeading',
	'allergensHeading',
	'allergensCta',
	'allergenColumn',
	'galleryHeading',
	'practicalHeading',
	'googleMaps',
	'appleMaps',
	'phoneLabel',
	'emailLabel',
	'instagram',
	'privacyLink',
	'kvkLabel',
	'btwLabel',
	'backHome',
];

/**
 * Both documents in one round trip. Assets are dereferenced so a gallery entry
 * can fall back to the uploaded file's own name when no filename is typed.
 */
export const CONTENT_QUERY = `{
  "site": *[_id == $siteId][0]{
    business,
    hours,
    announcement,
    hero,
    status,
    about,
    practical,
    gallery[]{
      filename,
      alt,
      caption,
      image,
      "originalFilename": image.asset->originalFilename
    },
    footer,
    ui,
    privacy,
    meta
  },
  "menu": *[_id == $menuId][0]{
    allergenCodes,
    allergenNotice,
    orderNotice,
    sections
  }
}`;

/** Reads an env var from the build process, or from Vite's env when defined. */
function env(name) {
	const fromProcess = typeof process !== 'undefined' ? process.env?.[name] : undefined;
	if (fromProcess) return fromProcess;
	// Bracket access on purpose: a static `import.meta.env.FOO` gets inlined by
	// Vite, which would bake a token into the bundle.
	const viteEnv = import.meta.env;
	return viteEnv?.[name] ?? undefined;
}

/* ------------------------------------------------------------------ shapes */

/** A `{ nl, en }` object with Sanity's `_type` stripped and no undefineds. */
function loc(value) {
	return { nl: value?.nl ?? '', en: value?.en ?? '' };
}

/** True when a locale object actually has something to say in either locale. */
function hasText(value) {
	return Boolean(value?.nl?.trim?.() || value?.en?.trim?.());
}

function str(value) {
	return typeof value === 'string' ? value : value == null ? '' : String(value);
}

/** `{ from, to }` objects back into the `["08:30", "17:00"]` tuples hours.js reads. */
function tuples(ranges) {
	return (Array.isArray(ranges) ? ranges : [])
		.filter((range) => range?.from && range?.to)
		.map((range) => [str(range.from), str(range.to)]);
}

/** A slug field, a plain string, or nothing. */
function slug(value) {
	if (typeof value === 'string') return value;
	return str(value?.current);
}

/** Paragraph arrays per locale, as the privacy page expects. */
function paragraphs(value) {
	const clean = (list) => (Array.isArray(list) ? list.map(str).filter((line) => line.trim()) : []);
	return { nl: clean(value?.nl), en: clean(value?.en) };
}

/**
 * The polaroid's aspect ratio, from Polaroid.astro. Sanity does the crop so the
 * focal point set in the studio is respected; Astro then downscales and
 * re-encodes, so this only has to be big enough not to be upscaled later.
 */
const GALLERY_CROP = { width: 1120, height: Math.round(1120 * 1.19) };

/**
 * Where Gallery.astro should get the photo.
 *
 * An uploaded photo wins and yields an absolute cdn.sanity.io URL, cropped
 * around its focal point. Without one we fall back to a bare filename, which
 * Gallery.astro matches against src/assets/gallery: it only uses the basename
 * without its extension, so "bar.jpg", "/img/bar.jpg" and "bar" are all the
 * same photo.
 *
 * @param item   one entry of the gallery array
 * @param urlFor hotspot-aware URL builder, or null when unavailable
 */
function gallerySrc(item, urlFor) {
	if (urlFor && item?.image?.asset?._ref) {
		try {
			return urlFor(item.image)
				.width(GALLERY_CROP.width)
				.height(GALLERY_CROP.height)
				.fit('crop')
				.auto('format')
				.url();
		} catch (error) {
			// A malformed asset reference must not take the whole build down.
			console.warn(`[content] could not build an image URL: ${error?.message ?? error}`);
		}
	}
	return str(item?.filename || item?.originalFilename);
}

/* --------------------------------------------------------- normalise: site */

export function normaliseSite(doc, urlFor = null) {
	if (!doc?.business) return null;

	const business = doc.business ?? {};
	const coordinates = business.coordinates ?? {};
	const hours = doc.hours ?? {};

	return {
		business: {
			name: str(business.name),
			legalName: str(business.legalName),
			legalForm: str(business.legalForm),
			kvk: str(business.kvk),
			btwId: str(business.btwId),
			street: str(business.street),
			postcode: str(business.postcode),
			city: str(business.city),
			country: str(business.country),
			email: str(business.email),
			phone: str(business.phone),
			instagram: str(business.instagram),
			// mapLinks() destructures this, so it always exists.
			coordinates: { lat: Number(coordinates.lat ?? 0), lng: Number(coordinates.lng ?? 0) },
			mapsUrl: str(business.mapsUrl),
		},

		hours: {
			regular: Object.fromEntries(
				DAY_KEYS.map((day) => [day, tuples(hours.regular?.[day])])
			),
			exceptions: (hours.exceptions ?? []).map((exception) => ({
				date: str(exception?.date),
				hours: tuples(exception?.hours),
				label: loc(exception?.label),
			})),
		},

		announcement: {
			active: Boolean(doc.announcement?.active),
			text: loc(doc.announcement?.text),
		},

		hero: {
			headline: loc(doc.hero?.headline),
			sub: loc(doc.hero?.sub),
		},

		status: {
			openUntil: loc(doc.status?.openUntil),
			closed: loc(doc.status?.closed),
			opensAt: loc(doc.status?.opensAt),
			opensToday: loc(doc.status?.opensToday),
		},

		about: {
			heading: loc(doc.about?.heading),
			body: loc(doc.about?.body),
		},

		// site.json nests these under `items`; the studio stores a flat array.
		practical: { items: (doc.practical ?? []).map(loc) },

		gallery: (doc.gallery ?? [])
			.map((item) => ({
				src: gallerySrc(item, urlFor),
				alt: loc(item.alt),
				caption: loc(item.caption),
			}))
			.filter((item) => item.src),

		footer: { credit: loc(doc.footer?.credit) },

		ui: Object.fromEntries(UI_KEYS.map((key) => [key, loc(doc.ui?.[key])])),

		privacy: {
			heading: loc(doc.privacy?.heading),
			updated: str(doc.privacy?.updated),
			updatedLabel: loc(doc.privacy?.updatedLabel),
			body: paragraphs(doc.privacy?.body),
		},

		meta: {
			title: loc(doc.meta?.title),
			description: loc(doc.meta?.description),
		},
	};
}

/* --------------------------------------------------------- normalise: menu */

function normaliseItem(item) {
	const out = {
		name: loc(item?.name),
		price: str(item?.price),
		allergens: (item?.allergens ?? []).map(str).filter(Boolean),
	};
	// Optional keys stay absent rather than empty, so the rendered markup is
	// identical to the JSON-fed one.
	if (hasText(item?.note)) out.note = loc(item.note);
	if (hasText(item?.addOn)) out.addOn = loc(item.addOn);
	if (item?.highlight) out.highlight = true;
	return out;
}

/** Options are flat in menu.json: `{ nl, en, allergens }`, not `{ label }`. */
function normaliseOption(option) {
	return {
		...loc(option?.label),
		allergens: (option?.allergens ?? []).map(str).filter(Boolean),
	};
}

export function normaliseMenu(doc) {
	if (!Array.isArray(doc?.sections) || doc.sections.length === 0) return null;

	return {
		// Sanity has no arbitrary-key map, so the legend is stored as a list and
		// rebuilt here into { G: { nl, en } }.
		allergenCodes: Object.fromEntries(
			(doc.allergenCodes ?? [])
				.filter((entry) => entry?.code)
				.map((entry) => [str(entry.code), loc(entry.label)])
		),
		allergenNotice: loc(doc.allergenNotice),
		orderNotice: loc(doc.orderNotice),
		sections: doc.sections.map((section) => {
			const out = {
				id: slug(section?.id),
				heading: loc(section?.heading),
			};
			if (hasText(section?.footnote)) out.footnote = loc(section.footnote);
			if (section?.groupPrice) out.groupPrice = str(section.groupPrice);
			if (section?.items?.length) out.items = section.items.map(normaliseItem);
			if (section?.options?.length) out.options = section.options.map(normaliseOption);
			return out;
		}),
	};
}

/* ------------------------------------------------------------------- fetch */

/**
 * @sanity/client is loaded through a variable specifier so Vite leaves the
 * import alone: a repo without the dependency installed still builds, it just
 * falls back to the local JSON.
 */
async function createClient() {
	const specifier = '@sanity/client';
	const { createClient: create } = await import(/* @vite-ignore */ specifier);
	const token = env('SANITY_READ_TOKEN');
	return create({
		projectId: PROJECT_ID,
		dataset: DATASET,
		apiVersion: API_VERSION,
		useCdn: true,
		perspective: 'published',
		// The dataset may well be public; only send a token when there is one.
		...(token ? { token } : {}),
	});
}

/**
 * The hotspot-aware image URL builder, or null when @sanity/image-url is not
 * installed. Loaded through a variable specifier for the same reason as the
 * client: a checkout without the dependency still builds, it just falls back to
 * the photos committed under src/assets/gallery.
 */
async function createUrlBuilder() {
	try {
		const specifier = '@sanity/image-url';
		// Named export: the default one is deprecated and warns on every build.
		const { createImageUrlBuilder } = await import(/* @vite-ignore */ specifier);
		const builder = createImageUrlBuilder({ projectId: PROJECT_ID, dataset: DATASET });
		return (source) => builder.image(source);
	} catch (error) {
		console.warn(`[content] @sanity/image-url is not available: ${error?.message ?? error}`);
		return null;
	}
}

/**
 * Both documents, normalised, or null when Sanity cannot answer or the dataset
 * is still empty. Never throws.
 *
 * @returns {Promise<{ site: object, menu: object } | null>}
 */
export async function fetchContent() {
	let client;
	try {
		client = await createClient();
	} catch (error) {
		console.warn(`[content] @sanity/client is not available: ${error?.message ?? error}`);
		return null;
	}

	let data;
	try {
		data = await client.fetch(CONTENT_QUERY, { siteId: SITE_DOC_ID, menuId: MENU_DOC_ID });
	} catch (error) {
		console.warn(`[content] Sanity query failed: ${error?.message ?? error}`);
		return null;
	}

	const urlFor = await createUrlBuilder();
	const site = normaliseSite(data?.site, urlFor);
	const menu = normaliseMenu(data?.menu);

	if (!site || !menu) {
		const missing = [!site && SITE_DOC_ID, !menu && MENU_DOC_ID].filter(Boolean).join(' and ');
		console.warn(`[content] Sanity has no usable document for ${missing}.`);
		return null;
	}

	return { site, menu };
}
