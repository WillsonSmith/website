// @ts-check
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

import { renderInThread } from '@hachi-dev/renderer';

const __dirname = dirname(join(fileURLToPath(import.meta.url), '../'));

export async function hachiIndexMiddleware(context, next) {
  if (context.url.endsWith('/')) {
    const index = glob.sync(join('dist', context.url, 'index.hachi.js'))[0];
    if (index) {
      const { html } = await renderInThread(join(__dirname, index));
      context.response.body = html;
      context.response.type = 'text/html';
    }
  }
  return next();
}
