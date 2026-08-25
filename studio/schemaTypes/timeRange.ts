import { defineType, defineField } from 'sanity';

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * One block of opening time. 24-hour clock, Europe/Amsterdam, "HH:MM".
 * A day with no ranges at all is closed.
 */
export const timeRange = defineType({
  name: 'timeRange',
  title: 'Opening block',
  type: 'object',
  options: { columns: 2 },
  fields: [
    defineField({
      name: 'from',
      title: 'From',
      type: 'string',
      description: '24h, e.g. 08:30',
      validation: (Rule) => Rule.required().regex(TIME, { name: 'HH:MM' }),
    }),
    defineField({
      name: 'to',
      title: 'Until',
      type: 'string',
      description: '24h, e.g. 17:00',
      validation: (Rule) => Rule.required().regex(TIME, { name: 'HH:MM' }),
    }),
  ],
  preview: {
    select: { from: 'from', to: 'to' },
    prepare: (selection: Record<string, any>) => ({
      title: `${selection.from ?? '??:??'}-${selection.to ?? '??:??'}`,
    }),
  },
});
