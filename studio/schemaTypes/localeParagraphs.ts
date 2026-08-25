import { defineType, defineField } from 'sanity';

/**
 * A list of paragraphs per locale, not one block of rich text: the privacy page
 * renders each entry as its own <p> and uses the first Dutch paragraph as the
 * page description. Keeping them as separate strings means the website never
 * has to serialise portable text.
 */
export const localeParagraphs = defineType({
  name: 'localeParagraphs',
  title: 'Paragraphs (nl / en)',
  type: 'object',
  fields: [
    defineField({
      name: 'nl',
      title: 'Nederlands',
      type: 'array',
      of: [{ type: 'text', rows: 3 }],
      description: 'One entry per paragraph.',
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'array',
      of: [{ type: 'text', rows: 3 }],
      description: 'One entry per paragraph, in the same order as the Dutch.',
    }),
  ],
});
