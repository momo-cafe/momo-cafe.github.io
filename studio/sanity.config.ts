import { defineConfig, type DocumentActionComponent } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

/**
 * There is exactly one café, one set of opening hours and one menu, so both
 * document types are singletons: a fixed _id, presented as a single document
 * rather than a list you can add to. The same ids are used by
 * scripts/seed-sanity.mjs in the website repo, so seeding is idempotent.
 */
const SINGLETONS = [
  { id: 'siteSettings', type: 'siteSettings', title: 'Site & hours' },
  { id: 'menu', type: 'menu', title: 'Menu' },
] as const;

const singletonTypes = new Set<string>(SINGLETONS.map((item) => item.type));

export default defineConfig({
  name: 'default',
  title: 'Café Momo',

  projectId: 'drw50awd',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Café Momo')
          .items(
            SINGLETONS.map((item) =>
              S.listItem()
                .title(item.title)
                .id(item.id)
                .child(
                  S.document().schemaType(item.type).documentId(item.id).title(item.title)
                )
            )
          ),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // No "create new" for singletons: there is only ever one of each.
    templates: (prev) => prev.filter((template) => !singletonTypes.has(template.schemaType)),
  },

  document: {
    // Duplicating or deleting a singleton would leave the website loader
    // without the document it queries by _id.
    actions: (prev, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? prev.filter((action: DocumentActionComponent) =>
            ['publish', 'discardChanges', 'restore'].includes(action.action ?? '')
          )
        : prev,
  },
});
