import { defineType, defineField } from 'sanity';

/**
 * A choice under a section that carries one price for the whole group (the
 * sweets card): no price of its own.
 */
export const menuOption = defineType({
  name: 'menuOption',
  title: 'Choice',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Name',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'allergens',
      title: 'Allergens',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Codes from the allergen legend on this document. Leave empty when unsure.',
    }),
  ],
  preview: {
    select: { title: 'label.nl', subtitle: 'label.en' },
  },
});
