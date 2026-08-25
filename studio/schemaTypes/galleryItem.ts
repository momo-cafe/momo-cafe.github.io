import { defineType, defineField } from 'sanity';

/**
 * Upload a photo and it appears on the website: the uploaded file is the source
 * of truth. The build downloads it from Sanity's CDN and re-encodes it to AVIF
 * and WebP, so a photo dragged in here is served from momo-cafe.nl like any
 * other asset, cropped around whatever focal point was set on it.
 *
 * `filename` stays for the three photos that shipped in the repo before the
 * studio existed (web/src/assets/gallery). It is only read when no photo has
 * been uploaded, so it never needs filling in again.
 */
export const galleryItem = defineType({
  name: 'galleryItem',
  title: 'Photo',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      description:
        'Drag a photo in. Use the crop tool to set what stays in frame; the website crops to a polaroid shape around it.',
      options: { hotspot: true },
      validation: (Rule) =>
        Rule.custom((value, context) => {
          // Either an upload or a repo filename, or there is nothing to show.
          const filename = (context.parent as { filename?: string } | undefined)?.filename;
          if (value?.asset || filename?.trim()) return true;
          return 'Upload a photo (or name one of the photos already in the repo).';
        }),
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'localeString',
      description: 'What is in the photo, for screen readers and search. Not the caption.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'localeString',
      description: 'The handwritten line under the polaroid.',
    }),
    defineField({
      name: 'filename',
      title: 'Repo filename (legacy)',
      type: 'string',
      description:
        'Only for photos that live in web/src/assets/gallery, e.g. "bar.jpg". Ignored as soon as a photo is uploaded above. Leave empty for new photos.',
    }),
  ],
  preview: {
    select: { title: 'caption.nl', subtitle: 'filename', media: 'image' },
  },
});
