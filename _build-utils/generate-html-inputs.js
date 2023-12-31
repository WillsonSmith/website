// @ts-check
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import { renderInThread } from '@hachi-dev/renderer';

import { replaceFileUrls } from './replace-file-urls.js';

const __dirname = dirname(join(fileURLToPath(import.meta.url), '../'));
/**
 *
 * @returns {Promise<{name: string, html: string}[]>}
 */
export async function generateHtmlInputs() {
  const pageFiles = glob.sync('dist/**/*.h.js');

  /**
   * @type {Promise<{name: string, html: string}>[]}
   */
  const htmlInputs = [];
  for (const page of pageFiles) {
    const filePath = join(__dirname, page);
    htmlInputs.push(
      renderInThread(filePath).then(({ html }) => ({
        name: page.replace('dist/', '').replace('.h.js', '.html'),
        html: replaceFileUrls(html),
      })),
    );
  }

  return Promise.all(htmlInputs);
}
