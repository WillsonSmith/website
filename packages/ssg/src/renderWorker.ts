import { workerData, parentPort } from 'worker_threads';

import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';

import type { TemplateResult, CSSResult } from 'lit';

// TemplateFn type that takes arbitrary arguments and returns a string
type TemplateFn = (args: { [key: string]: unknown }) => string;

interface SourceModule {
  default: (args: { [key: string]: unknown }) => Promise<TemplateResult>;
  layout: any;
  [key: string]: unknown;
}

try {
  const { source, options } = workerData;
  const {
    default: renderModule,
    layout,
    ...rest
  } = (await import(source)) as SourceModule;
  const result = render(await renderModule({ ...options, ...rest }));
  let markup = await collectResult(result);
  if (layout) {
    markup = layout({
      content: markup,
      ...options,
    });
  }
  parentPort!.postMessage({ markup });
} catch (error) {
  parentPort!.postMessage({ error });
}
