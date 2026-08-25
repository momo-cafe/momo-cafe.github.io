import { defineType, defineField } from 'sanity';

const DAYS = [
  ['mon', 'Monday'],
  ['tue', 'Tuesday'],
  ['wed', 'Wednesday'],
  ['thu', 'Thursday'],
  ['fri', 'Friday'],
  ['sat', 'Saturday'],
  ['sun', 'Sunday'],
] as const;

/**
 * The regular week. Every day is a list of opening blocks, so a lunch break is
 * two blocks and a closing day is an empty list. The website collapses
 * consecutive identical days into "ma-vr 08:30-17:00" by itself.
 */
export const weekHours = defineType({
  name: 'weekHours',
  title: 'Regular week',
  type: 'object',
  fields: DAYS.map(([name, title]) =>
    defineField({
      name,
      title,
      type: 'array',
      of: [{ type: 'timeRange' }],
      description: 'Leave empty for closed all day.',
    })
  ),
});
