// @ts-check
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = join(dirname(fileURLToPath(import.meta.url)), '../');

/**
 * @param {string} srcHtml
 * @returns {string}
 * */
export function replaceFileUrls(srcHtml) {
  let html = srcHtml;
  const matches = html.match(/file:\/\/[^"]*/g);
  if (matches) {
    for (const match of matches) {
      if (match.includes('.js')) {
        html = html.replace(
          match,
          match.replace(pathToFileURL(__dirname).href, __dirname),
        );
      } else {
        html = html
          .replace('/dist/', '/src/')
          .replace(pathToFileURL(__dirname).href, '');
      }
    }
  }

  return html;
}
