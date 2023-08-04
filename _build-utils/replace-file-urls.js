// @ts-check
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = join(dirname(fileURLToPath(import.meta.url)), '../');

/**
 *
 * @param {string} html
 * @returns {string}
 */
export function replaceFileUrls(html) {
  return html
    .split('\n')
    .map(line => {
      if (line.includes('file://')) {
        if (line.includes('.js')) {
          return line.replace(pathToFileURL(__dirname).href, __dirname);
        }
        return line.replace(pathToFileURL(__dirname).href, '');
      }
      return line;
    })
    .join('\n');
}
