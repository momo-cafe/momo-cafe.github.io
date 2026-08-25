import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: 'drw50awd',
    dataset: 'production',
  },
  /**
   * The studio is deployed on its own, not with the website: run
   * `npm run studio:deploy` from the repo root (or `npm run deploy` here) to
   * publish it to <name>.sanity.studio.
   */
  deployment: { autoUpdates: true },
});
