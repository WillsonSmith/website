import { dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

import { trailingSlashMiddleware } from './_dev-server-utils/trailing-slash-middleware.js';
import { hachiIndexMiddleware } from './_dev-server-utils/hachi-index-middleware.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  open: true,
  rootDir: './',
  watch: true,
  nodeResolve: {
    exportConditions: ['browser'],
  },
  plugins: [
    {
      name: 'replace-file-urls',
      async transform(context) {
        if (context.response.is('html')) {
          // @ts-ignore
          context.body = context.body.replaceAll(
            pathToFileURL(__dirname).href,
            '',
          );
        }
        return context.body;
      },
    },
  ],
  middleware: [trailingSlashMiddleware, hachiIndexMiddleware],
});
