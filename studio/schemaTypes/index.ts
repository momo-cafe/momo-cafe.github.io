import type { SchemaTypeDefinition } from 'sanity';

import { localeString } from './localeString';
import { localeText } from './localeText';
import { localeParagraphs } from './localeParagraphs';
import { timeRange } from './timeRange';
import { weekHours } from './weekHours';
import { hoursException } from './hoursException';
import { galleryItem } from './galleryItem';
import { allergenCode } from './allergenCode';
import { menuItem } from './menuItem';
import { menuOption } from './menuOption';
import { menuSection } from './menuSection';
import { siteSettings } from './siteSettings';
import { menu } from './menu';

/** Objects first, then the two singleton documents. */
export const schemaTypes: SchemaTypeDefinition[] = [
  localeString,
  localeText,
  localeParagraphs,
  timeRange,
  weekHours,
  hoursException,
  galleryItem,
  allergenCode,
  menuItem,
  menuOption,
  menuSection,
  siteSettings,
  menu,
];
