import { workerData, parentPort } from 'worker_threads';
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
try {
    const { source, options } = workerData;
    const { default: renderModule, layout, ...rest } = (await import(source));
    const result = render(await renderModule({ ...options, ...rest }));
    let markup = await collectResult(result);
    if (layout) {
        markup = layout({
            content: markup,
            ...options,
            ...rest,
        });
    }
    parentPort.postMessage({ markup });
}
catch (error) {
    parentPort.postMessage({ error });
}
