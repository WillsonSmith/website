import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Worker } from 'worker_threads';
const __dirname = dirname(fileURLToPath(import.meta.url));
export function render(source, options) {
    const result = new Promise((resolve, reject) => {
        const worker = new Worker(`${__dirname}/renderWorker.js`, {
            workerData: {
                source,
                options,
            },
        });
        worker.on('message', resolve);
        worker.on('error', reject);
    });
    return result;
}
