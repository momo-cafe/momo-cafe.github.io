#!/usr/bin/env node
/*
 * Seed the Sanity dataset from the JSON that is already in the repo.
 *
 * This is the exact inverse of the normalisation in src/lib/sanity.js: it turns
 * src/content/site.json and src/content/menu.json into the two singleton
 * documents the studio schema describes, and writes them with createOrReplace
 * under fixed ids, so running it twice is the same as running it once.
 *
 *   node scripts/seed-sanity.mjs --dry-run     # print, write nothing
 *   SANITY_WRITE_TOKEN=... node scripts/seed-sanity.mjs
 *
 * Create the token at
 * https://www.sanity.io/manage/project/drw50awd/api → Tokens → Add API token,
 * with Editor permissions. It is a write credential: keep it out of the repo.
 *
 * WARNING: createOrReplace overwrites. Once the owner is editing in the studio,
 * this script would throw her changes away. It is a one-time bootstrap.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const PROJECT_ID = 'drw50awd';
const DATASET = 'production';
const API_VERSION = '2026-08-01';

/** Same ids the website loader queries by, in src/lib/sanity.js. */
const SITE_DOC_ID = 'siteSettings';
const MENU_DOC_ID = 'menu';

const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run') || args.includes('-n');

/* ----------------------------------------------------------------- helpers */

/**
 * Array item keys. Deterministic on purpose: a random key on every run would
 * make each seed look like a wholesale rewrite in the document history.
 */
const key = (prefix, index) => `${prefix}${index}`;

/** Drop the `_note` annotations the JSON files carry for human readers. */
function withoutNotes(object) {
	return Object.fromEntries(Object.entries(object ?? {}).filter(([name]) => name !== '_note'));
}

const localeString = (value) => ({
	_type: 'localeString',
	nl: value?.nl ?? '',
	en: value?.en ?? '',
});

const localeText = (value) => ({
	_type: 'localeText',
	nl: value?.nl ?? '',
	en: value?.en ?? '',
});

const localeParagraphs = (value) => ({
	_type: 'localeParagraphs',
	nl: [...(value?.nl ?? [])],
	en: [...(value?.en ?? [])],
});

/** `["08:30", "17:00"]` tuples into timeRange objects. */
const timeRanges = (ranges, prefix) =>
	(ranges ?? []).map(([from, to], index) => ({
		_key: key(prefix, index),
		_type: 'timeRange',
		from,
		to,
	}));

/* -------------------------------------------------------- site.json → doc */

function siteDocument(site) {
	const business = withoutNotes(site.business);
	const hours = withoutNotes(site.hours);
	const ui = withoutNotes(site.ui);
	const privacy = withoutNotes(site.privacy);

	return {
		_id: SITE_DOC_ID,
		_type: 'siteSettings',

		business: {
			...business,
			coordinates: {
				lat: business.coordinates?.lat ?? 0,
				lng: business.coordinates?.lng ?? 0,
			},
		},

		hours: {
			regular: {
				_type: 'weekHours',
				...Object.fromEntries(
					DAY_KEYS.map((day) => [day, timeRanges(hours.regular?.[day], `${day}-`)])
				),
			},
			exceptions: (hours.exceptions ?? []).map((exception, index) => ({
				_key: key('exception', index),
				_type: 'hoursException',
				date: exception.date,
				hours: timeRanges(exception.hours, `x${index}-`),
				label: localeString(exception.label),
			})),
		},

		announcement: {
			active: Boolean(site.announcement?.active),
			text: localeString(site.announcement?.text),
		},

		hero: {
			headline: localeString(site.hero?.headline),
			sub: localeString(site.hero?.sub),
		},

		status: Object.fromEntries(
			['openUntil', 'closed', 'opensAt', 'opensToday'].map((name) => [
				name,
				localeString(site.status?.[name]),
			])
		),

		about: {
			heading: localeString(site.about?.heading),
			body: localeText(site.about?.body),
		},

		// The studio stores a flat array; site.json nests it under `items`.
		practical: (site.practical?.items ?? []).map((item, index) => ({
			_key: key('practical', index),
			...localeString(item),
		})),

		gallery: (site.gallery ?? []).map((item, index) => ({
			_key: key('photo', index),
			_type: 'galleryItem',
			// Kept verbatim. Gallery.astro matches on the basename without its
			// extension, so the /img/ prefix is inert either way.
			filename: String(item.src),
			alt: localeString(item.alt),
			caption: localeString(item.caption),
		})),

		footer: { credit: localeString(site.footer?.credit) },

		ui: Object.fromEntries(
			Object.entries(ui).map(([name, value]) => [name, localeString(value)])
		),

		privacy: {
			heading: localeString(privacy.heading),
			updated: privacy.updated,
			updatedLabel: localeString(privacy.updatedLabel),
			body: localeParagraphs(privacy.body),
		},

		meta: {
			title: localeString(site.meta?.title),
			description: localeText(site.meta?.description),
		},
	};
}

/* -------------------------------------------------------- menu.json → doc */

function menuItemDocument(item, index) {
	const out = {
		_key: key('item', index),
		_type: 'menuItem',
		name: localeString(item.name),
		// Strings, always: "2,9" and "3,9 / 4,5" are what the card prints.
		price: String(item.price ?? ''),
		allergens: [...(item.allergens ?? [])],
	};
	if (item.note) out.note = localeText(item.note);
	if (item.addOn) out.addOn = localeString(item.addOn);
	if (item.highlight) out.highlight = true;
	return out;
}

function menuDocument(menu) {
	return {
		_id: MENU_DOC_ID,
		_type: 'menu',

		// The code -> label map becomes a list: Sanity has no arbitrary keys.
		allergenCodes: Object.entries(menu.allergenCodes ?? {})
			.filter(([code]) => code !== '_note')
			.map(([code, label], index) => ({
				_key: key('allergen', index),
				_type: 'allergenCode',
				code,
				label: localeString(label),
			})),

		allergenNotice: localeText(menu.allergenNotice),
		orderNotice: localeString(menu.orderNotice),

		sections: (menu.sections ?? []).map((section, index) => {
			const out = {
				_key: key('section', index),
				_type: 'menuSection',
				id: { _type: 'slug', current: section.id },
				heading: localeString(section.heading),
			};
			if (section.footnote) out.footnote = localeText(section.footnote);
			if (section.groupPrice) out.groupPrice = String(section.groupPrice);
			// Absent, not empty, when a section carries only choices: that is how
			// menu.json has it, and the loader mirrors it back the same way.
			if (section.items?.length) out.items = section.items.map(menuItemDocument);
			if (section.options?.length) {
				out.options = section.options.map((option, optionIndex) => ({
					_key: key('option', optionIndex),
					_type: 'menuOption',
					// Flat { nl, en } in menu.json, a `label` object in the schema.
					label: localeString(option),
					allergens: [...(option.allergens ?? [])],
				}));
			}
			return out;
		}),
	};
}

/* -------------------------------------------------------------------- main */

async function main() {
	const [site, menu] = await Promise.all([
		readFile(path.join(root, 'src/content/site.json'), 'utf8').then(JSON.parse),
		readFile(path.join(root, 'src/content/menu.json'), 'utf8').then(JSON.parse),
	]);

	const documents = [siteDocument(site), menuDocument(menu)];

	if (dryRun) {
		console.log(
			`# dry run: would createOrReplace ${documents.length} documents in ` +
				`project ${PROJECT_ID}, dataset ${DATASET}\n`
		);
		console.log(JSON.stringify(documents, null, 2));
		for (const document of documents) {
			console.log(`\n# ${document._id} (${document._type}): ${Object.keys(document).length} keys`);
		}
		console.log('\n# nothing was written.');
		return;
	}

	const token = process.env.SANITY_WRITE_TOKEN;
	if (!token) {
		console.error(
			'SANITY_WRITE_TOKEN is not set.\n\n' +
				'This script writes to the live dataset, so it will not run without one.\n' +
				`Create a token with Editor permissions at\n` +
				`  https://www.sanity.io/manage/project/${PROJECT_ID}/api\n` +
				'then:\n' +
				'  SANITY_WRITE_TOKEN=sk... node scripts/seed-sanity.mjs\n\n' +
				'Or inspect what it would do first:\n' +
				'  node scripts/seed-sanity.mjs --dry-run'
		);
		process.exitCode = 1;
		return;
	}

	const { createClient } = await import('@sanity/client');
	const client = createClient({
		projectId: PROJECT_ID,
		dataset: DATASET,
		apiVersion: API_VERSION,
		token,
		useCdn: false,
	});

	const transaction = documents.reduce(
		(tx, document) => tx.createOrReplace(document),
		client.transaction()
	);

	const result = await transaction.commit();
	console.log(
		`Wrote ${documents.map((document) => document._id).join(' and ')} ` +
			`to ${PROJECT_ID}/${DATASET} (transaction ${result.transactionId}).`
	);
}

main().catch((error) => {
	console.error(error?.message ?? error);
	process.exitCode = 1;
});
