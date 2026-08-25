import { defineType, defineField } from 'sanity';

/**
 * One row of the allergen legend. Sanity has no arbitrary-key map type, so the
 * code -> label map in menu.json is stored as a list and turned back into
 * { G: { nl, en } } by the website loader.
 */
export const allergenCode = defineType({
  name: 'allergenCode',
  title: 'Allergen',
  type: 'object',
  fields: [
    defineField({
      name: 'code',
      title: 'Code',
      type: 'string',
      description:
        'Short code as it appears next to a menu item, uppercase: G, L, N, P, E, S, SE, SU. Items refer to this exact code.',
      validation: (Rule) =>
        Rule.required()
          .uppercase()
          .max(3)
          .regex(/^[A-Z]+$/, { name: 'uppercase letters' }),
    }),
    defineField({
      name: 'label',
      title: 'Name',
      type: 'localeString',
      description: 'What the code means, e.g. gluten / gluten.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { code: 'code', nl: 'label.nl', en: 'label.en' },
    prepare: (selection: Record<string, any>) => ({
      title: `${selection.code ?? '?'} · ${selection.nl ?? ''}`,
      subtitle: selection.en,
    }),
  },
});
