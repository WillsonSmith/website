import {dirname} from 'path';
import {fileURLToPath} from 'url';

import {Worker} from 'worker_threads';

import {RenderResolve, RenderReject} from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
export function render(source: string, options?: {[key: string]: unknown;}) {
  const result = new Promise((resolve: RenderResolve, reject: RenderReject) => {
    const worker = new Worker(`${__dirname}/renderWorker.js`, {
      workerData: {
        source,
        options,
      },
    });

    worker.on('message', resolve);
    worker.on('error', reject);
  })

  return result;
}

