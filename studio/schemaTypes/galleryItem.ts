import { defineType, defineField } from 'sanity';

/**
 * The website renders the photos from src/assets/gallery so Astro can generate
 * AVIF and WebP for them, and matches them on filename. `filename` is therefore
 * the field that decides which photo appears and in what order; `image` is here
 * so the owner can see what she is ordering, and so a future build step can
 * pull the file straight from Sanity.
 */
export const galleryItem = defineType({
  name: 'galleryItem',
  title: 'Photo',
  type: 'object',
  fields: [
    defineField({
      name: 'filename',
      title: 'Filename',
      type: 'string',
      description:
        'The file in src/assets/gallery, e.g. "bar.jpg". Only the name matters, the extension and any path are ignored.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional reference copy of the same photo.',
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'localeString',
      description: 'What is in the photo, for screen readers. Not the caption.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'localeString',
      description: 'The handwritten line under the polaroid.',
    }),
  ],
  preview: {
    select: { title: 'caption.nl', subtitle: 'filename', media: 'image' },
  },
});
