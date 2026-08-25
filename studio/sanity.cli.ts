import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: 'drw50awd',
    dataset: 'production',
  },
  /**
   * The studio is deployed on its own, not with the website: run
   * `npm run deploy` in this folder to publish it to <name>.sanity.studio.
   */
  autoUpdates: true,
});
