import { defineType, defineField } from 'sanity';

/**
 * The localisation seam. Every visitor-facing string is one of these; the
 * website reads them through t(field, locale) in src/lib/t.js, which falls
 * back to nl when en is empty.
 */
export const localeString = defineType({
  name: 'localeString',
  title: 'Text (nl / en)',
  type: 'object',
  options: { columns: 2 },
  fields: [
    defineField({ name: 'nl', title: 'Nederlands', type: 'string' }),
    defineField({ name: 'en', title: 'English', type: 'string' }),
  ],
  preview: {
    select: { nl: 'nl', en: 'en' },
    prepare: (selection: Record<string, any>) => ({
      title: selection.nl || selection.en || '(empty)',
      subtitle: selection.nl && selection.en ? selection.en : undefined,
    }),
  },
});
