import { defineType, defineField } from 'sanity';

/**
 * One card: coffee, not coffee, food, sweets. A section either lists priced
 * items or carries one group price with choices beneath it.
 */
export const menuSection = defineType({
  name: 'menuSection',
  title: 'Section',
  type: 'object',
  fields: [
    defineField({
      name: 'id',
      title: 'Anchor',
      type: 'slug',
      description: 'Used as the id in the page URL, e.g. "koffie". Do not change it once shared.',
      options: { source: 'heading.nl', maxLength: 32 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'footnote',
      title: 'Footnote',
      type: 'localeText',
      description:
        'Real content that belongs to this section, e.g. "oat or coconut milk, decaf and iced available". Line breaks are kept.',
    }),
    defineField({
      name: 'groupPrice',
      title: 'Group price',
      type: 'string',
      description:
        'One price for the whole section, as a STRING exactly as printed, e.g. "4,9". Set this only when the card prints one price against the group instead of per line, and then use Choices below instead of Items.',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{ type: 'menuItem' }],
    }),
    defineField({
      name: 'options',
      title: 'Choices',
      type: 'array',
      of: [{ type: 'menuOption' }],
      description: 'Only for a section with a group price.',
    }),
  ],
  preview: {
    select: { title: 'heading.nl', items: 'items', options: 'options', groupPrice: 'groupPrice' },
    prepare: (selection: Record<string, any>) => {
      const count = (selection.items?.length ?? 0) + (selection.options?.length ?? 0);
      return {
        title: selection.title ?? '(no heading)',
        subtitle:
          `${count} line${count === 1 ? '' : 's'}` +
          (selection.groupPrice ? ` · € ${selection.groupPrice}` : ''),
      };
    },
  },
});
