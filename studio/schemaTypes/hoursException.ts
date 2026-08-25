import { defineType, defineField } from 'sanity';

/**
 * Overrides the regular week for a single date: a holiday, or a day the café
 * opens late. This is how the café closes for Christmas without touching code.
 */
export const hoursException = defineType({
  name: 'hoursException',
  title: 'Exception',
  type: 'object',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hours',
      title: 'Opening blocks that day',
      type: 'array',
      of: [{ type: 'timeRange' }],
      description: 'Leave empty to close all day.',
    }),
    defineField({
      name: 'label',
      title: 'Why',
      type: 'localeString',
      description: 'Shown to visitors, e.g. "Eerste kerstdag" / "Christmas Day".',
    }),
  ],
  preview: {
    select: { date: 'date', label: 'label.nl', hours: 'hours' },
    prepare: (selection: Record<string, any>) => ({
      title: [selection.date ?? 'no date', selection.label].filter(Boolean).join(' · '),
      subtitle: selection.hours?.length
        ? selection.hours.map((range: any) => `${range.from}-${range.to}`).join(', ')
        : 'closed all day',
    }),
  },
});
