import { defineType, defineField } from 'sanity';

/** A priced line on the card. */
export const menuItem = defineType({
  name: 'menuItem',
  title: 'Item',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'localeString',
      description: 'Lowercase, exactly as printed on the card.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'localeText',
      description: 'What is in it. The small line under the name.',
    }),
    defineField({
      name: 'addOn',
      title: 'Add-on',
      type: 'localeString',
      description: 'An optional upgrade, e.g. "make it a tuna melt +2".',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      description:
        'A STRING, exactly as printed: comma decimal, no euro sign, e.g. "2,9" or "3,9 / 4,5" for two sizes. Never a number: 2.9 would render as 2,90 and a second size cannot be expressed at all.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'allergens',
      title: 'Allergens',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Codes from the allergen legend on this document, e.g. G, L. Leave empty when you do not know for certain: the ask-at-the-bar notice covers it, and guessing is unsafe.',
    }),
    defineField({
      name: 'highlight',
      title: 'Highlight',
      type: 'boolean',
      description: 'Puts a small dot in front of the name. Use sparingly.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'name.nl', price: 'price', note: 'note.nl' },
    prepare: (selection: Record<string, any>) => ({
      title: `${selection.title ?? '(no name)'}${selection.price ? `  ${selection.price}` : ''}`,
      subtitle: selection.note,
    }),
  },
});
