import { defineType, defineField } from 'sanity';

/** Same as localeString, but multi-line. Line breaks are kept as typed. */
export const localeText = defineType({
  name: 'localeText',
  title: 'Longer text (nl / en)',
  type: 'object',
  fields: [
    defineField({ name: 'nl', title: 'Nederlands', type: 'text', rows: 3 }),
    defineField({ name: 'en', title: 'English', type: 'text', rows: 3 }),
  ],
  preview: {
    select: { nl: 'nl', en: 'en' },
    prepare: (selection: Record<string, any>) => ({
      title: selection.nl || selection.en || '(empty)',
    }),
  },
});
