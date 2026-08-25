import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: 'drw50awd',
    dataset: 'production',
  },
  /**
   * The studio is deployed on its own, not with the website: run
   * `npm run studio:deploy` from the repo root. `studioHost` claims
   * https://momo-cafe.sanity.studio, so the deploy never has to ask.
   */
  studioHost: 'momo-cafe',
  deployment: {
    // Without an appId the studio tracks the latest channel on every deploy;
    // pinning the application lets Sanity manage its version explicitly.
    appId: 'l92r7ggcl9f8t558i6nrm321',
    autoUpdates: true,
  },
});
