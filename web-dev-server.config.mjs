import { glob } from 'glob';
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import { renderInThread } from '@hachi-dev/renderer';

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
            ''
          );
        }
        return context.body;
      },
    },
  ],
  middleware: [trailingSlashMiddleware, hachiIndexMiddleware],
});

async function trailingSlashMiddleware(context, next) {
  if (!context.url.includes('.') && !context.url.endsWith('/')) {
    context.redirect(`${context.url}/`);
  }
  return next();
}

async function hachiIndexMiddleware(context, next) {
  if (context.url.endsWith('/')) {
    const index = glob.sync(join('src', context.url, 'index.hachi.js'))[0];
    if (index) {
      const html = (await renderInThread(join(__dirname, index))).html;
      context.response.body = html;
      context.response.type = 'text/html';
    }
  }
  return next();
}
