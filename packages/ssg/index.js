import { Worker } from 'worker_threads';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 *
 * @param {string} source
 * @param {object} [options]
 * @returns {Promise<{markup: string}>}
 */
export function render(source, options) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(`${__dirname}/worker/renderWorker.js`, {
      workerData: {
        source,
        options,
      },
    });

    worker.on('message', (message) => {
      if (message.error) {
        reject(message.error);
      } else {
        resolve(message);
      }
    });

    worker.on('error', reject);
  });
}
