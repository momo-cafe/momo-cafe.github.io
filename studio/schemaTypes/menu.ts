import { defineType, defineField } from 'sanity';

/**
 * Singleton, _id "menu". Mirrors src/content/menu.json.
 *
 * Prices are strings throughout, exactly as printed on the card.
 */
export const menu = defineType({
  name: 'menu',
  title: 'Menu',
  type: 'document',
  fields: [
    defineField({
      name: 'allergenCodes',
      title: 'Allergen legend',
      type: 'array',
      of: [{ type: 'allergenCode' }],
      description:
        'The codes items can refer to. Only codes actually used on the card are shown to visitors.',
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: 'allergenNotice',
      title: 'Allergen notice',
      type: 'localeText',
      description:
        'The ask-at-the-bar line. Dutch law requires allergen information to be freely accessible; while per-item data is incomplete, this notice is what satisfies that, so it must never be empty.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'orderNotice',
      title: 'Ordering notice',
      type: 'localeString',
      description: 'The small line above the card, e.g. "bestellen aan de bar".',
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [{ type: 'menuSection' }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { sections: 'sections' },
    prepare: (selection: Record<string, any>) => {
      const count = selection.sections?.length ?? 0;
      return { title: 'Menu', subtitle: `${count} section${count === 1 ? '' : 's'}` };
    },
  },
});
