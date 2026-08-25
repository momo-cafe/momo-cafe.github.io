import { defineType, defineField } from 'sanity';

/**
 * Singleton, _id "siteSettings". Mirrors src/content/site.json one to one; the
 * website normalises this document straight back into that shape, so nothing in
 * src/components ever learns that Sanity exists.
 */

const UI_STRINGS: [name: string, title: string, description?: string][] = [
  ['skip', 'Skip link', 'The keyboard-only link at the very top of the page.'],
  ['languageLabel', 'Language switch label'],
  ['routeCta', 'Route button'],
  ['menuCta', 'Menu button'],
  ['hoursHeading', 'Opening hours heading'],
  ['closedDay', 'Closed (a day in the hours list)'],
  ['today', 'Today'],
  ['whereHeading', 'Where heading'],
  ['menuHeading', 'Menu heading'],
  ['allergensHeading', 'Allergens heading'],
  ['allergensCta', 'Allergens link'],
  ['allergenColumn', 'Allergen column label', 'Read out by screen readers next to a code.'],
  ['galleryHeading', 'Gallery heading'],
  ['practicalHeading', 'Practical heading'],
  ['googleMaps', 'Google Maps'],
  ['appleMaps', 'Apple Maps'],
  ['phoneLabel', 'Call'],
  ['emailLabel', 'Email'],
  ['instagram', 'Instagram'],
  ['privacyLink', 'Privacy link'],
  ['kvkLabel', 'KVK label'],
  ['btwLabel', 'VAT id label'],
  ['backHome', 'Back to the site'],
];

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site & hours',
  type: 'document',
  groups: [
    { name: 'business', title: 'Business', default: true },
    { name: 'hours', title: 'Hours' },
    { name: 'content', title: 'Copy' },
    { name: 'ui', title: 'Interface strings' },
    { name: 'legal', title: 'Privacy & meta' },
  ],
  fields: [
    defineField({
      name: 'business',
      title: 'Business',
      type: 'object',
      group: 'business',
      fields: [
        defineField({
          name: 'name',
          title: 'Name',
          type: 'string',
          description: 'The name on the door, e.g. Café Momo.',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'legalName',
          title: 'Legal name',
          type: 'string',
          description: 'Exactly as registered at the KVK. Shown in the footer.',
        }),
        defineField({
          name: 'legalForm',
          title: 'Legal form',
          type: 'string',
          description: 'eenmanszaak, VOF, BV.',
        }),
        defineField({
          name: 'kvk',
          title: 'KVK number',
          type: 'string',
          description:
            'The 8-digit number. Legally required on a Dutch commercial website: the build refuses to run without it.',
        }),
        defineField({
          name: 'btwId',
          title: 'btw-id',
          type: 'string',
          description:
            'The btw-identificatienummer, NL000000000B00. Never the OB number. Legally required, like the KVK number.',
        }),
        defineField({
          name: 'street',
          title: 'Street and number',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'postcode',
          title: 'Postcode',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'city',
          title: 'City',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'country',
          title: 'Country code',
          type: 'string',
          description: 'Two letters, e.g. NL.',
          initialValue: 'NL',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'email',
          title: 'Email',
          type: 'string',
          description: 'Leave empty to hide the email link everywhere.',
        }),
        defineField({
          name: 'phone',
          title: 'Phone',
          type: 'string',
          description:
            'Leave empty to hide the tappable tel: link. Written as you want it read, e.g. +31 50 123 45 67.',
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
        }),
        defineField({
          name: 'coordinates',
          title: 'Coordinates',
          type: 'object',
          description: 'Used for the Apple Maps link and the LocalBusiness schema.',
          options: { columns: 2 },
          fields: [
            defineField({
              name: 'lat',
              title: 'Latitude',
              type: 'number',
              validation: (Rule) => Rule.required().min(-90).max(90),
            }),
            defineField({
              name: 'lng',
              title: 'Longitude',
              type: 'number',
              validation: (Rule) => Rule.required().min(-180).max(180),
            }),
          ],
        }),
        defineField({
          name: 'mapsUrl',
          title: 'Google Maps share link',
          type: 'url',
          description:
            'The share link from the Google Business Profile. Leave empty and the site generates a Maps search for the address instead.',
        }),
      ],
    }),

    defineField({
      name: 'hours',
      title: 'Opening hours',
      type: 'object',
      group: 'hours',
      description: '24h, Europe/Amsterdam. The live open/closed line is computed from this.',
      fields: [
        defineField({
          name: 'regular',
          title: 'Regular week',
          type: 'weekHours',
        }),
        defineField({
          name: 'exceptions',
          title: 'Exceptions',
          type: 'array',
          of: [{ type: 'hoursException' }],
          description: 'Holidays and one-off changes. These win over the regular week.',
        }),
      ],
    }),

    defineField({
      name: 'announcement',
      title: 'Announcement banner',
      type: 'object',
      group: 'content',
      description: 'The one field to reach for when something changes today.',
      fields: [
        defineField({
          name: 'active',
          title: 'Show the banner',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'text',
          title: 'Text',
          type: 'localeString',
          description: 'Empty text hides the banner even when it is switched on.',
        }),
      ],
    }),

    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'localeString' }),
        defineField({ name: 'sub', title: 'Sub-headline', type: 'localeString' }),
      ],
    }),

    defineField({
      name: 'status',
      title: 'Open / closed wording',
      type: 'object',
      group: 'content',
      description: 'The live line above the headline. {time} is replaced by the actual time.',
      fields: [
        defineField({
          name: 'openUntil',
          title: 'Open now',
          type: 'localeString',
          description: 'Use {time} for the closing time, e.g. "nu open tot {time}".',
        }),
        defineField({
          name: 'closed',
          title: 'Closed',
          type: 'localeString',
          description: 'No {time}: used when the café is not open today or tomorrow.',
        }),
        defineField({
          name: 'opensAt',
          title: 'Opens tomorrow',
          type: 'localeString',
          description: 'Use {time} for the opening time.',
        }),
        defineField({
          name: 'opensToday',
          title: 'Opens later today',
          type: 'localeString',
          description: 'Use {time} for the opening time.',
        }),
      ],
    }),

    defineField({
      name: 'about',
      title: 'About',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'localeString' }),
        defineField({
          name: 'body',
          title: 'Body',
          type: 'localeText',
          description: 'Two or three sentences in the owner’s own words. No marketing language.',
        }),
      ],
    }),

    defineField({
      name: 'practical',
      title: 'Practical',
      type: 'array',
      group: 'content',
      of: [{ type: 'localeString' }],
      description:
        'Small true facts, one per line: card and cash, oat milk at no extra charge. Delete any that stop being true rather than fudging them.',
    }),

    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'content',
      of: [{ type: 'galleryItem' }],
      description: 'Which photos appear, and in what order.',
    }),

    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      group: 'content',
      fields: [defineField({ name: 'credit', title: 'Credit line', type: 'localeString' })],
    }),

    defineField({
      name: 'ui',
      title: 'Interface strings',
      type: 'object',
      group: 'ui',
      description:
        'Everything a visitor can read that is not copy: buttons, headings, labels. Components hardcode no text at all.',
      options: { collapsible: true, collapsed: false },
      fields: UI_STRINGS.map(([name, title, description]) =>
        defineField({ name, title, type: 'localeString', description })
      ),
    }),

    defineField({
      name: 'privacy',
      title: 'Privacy statement',
      type: 'object',
      group: 'legal',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'localeString' }),
        defineField({
          name: 'updated',
          title: 'Last updated',
          type: 'date',
          options: { dateFormat: 'YYYY-MM-DD' },
        }),
        defineField({ name: 'updatedLabel', title: '"Last updated" label', type: 'localeString' }),
        defineField({
          name: 'body',
          title: 'Body',
          type: 'localeParagraphs',
          description:
            'The statement is short on purpose: no analytics, no cookies, no forms. If analytics is ever added it must be cookieless, and a banner becomes mandatory.',
        }),
      ],
    }),

    defineField({
      name: 'meta',
      title: 'Search and sharing',
      type: 'object',
      group: 'legal',
      fields: [
        defineField({
          name: 'title',
          title: 'Page title',
          type: 'localeString',
          description: 'Shown in the browser tab and as the blue line in Google.',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'localeText',
          description: 'Around 155 characters. Shown under the title in Google.',
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'business.name' },
    prepare: (selection: Record<string, any>) => ({
      title: selection.title ?? 'Site & hours',
      subtitle: 'Business, hours and all site copy',
    }),
  },
});
