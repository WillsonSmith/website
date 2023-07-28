import { render as renderStatic } from 'ssg';

import { writeFile } from 'fs/promises';

import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import { glob } from 'glob';

glob('src/pages/**/*.js').then(async (files) => {
  for (const file of files) await buildPage(file);
});

/**
 *
 * @param {string} page
 */
async function buildPage(page) {
  try {
    const filePath = join(__dirname, page);
    const result = (await renderStatic(filePath)).markup;
    if (result) {
      const rootFilePathUrl = pathToFileURL(__dirname);
      await writeFile(
        filePath.replace('js', 'html'),
        result.replaceAll(rootFilePathUrl.href, '')
      );
    }
  } catch (e) {
    console.log('No markup found for', page);
  }
}
