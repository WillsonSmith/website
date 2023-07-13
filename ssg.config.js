import { ssg, render as renderStatic } from 'ssg';

import { writeFile } from 'fs/promises';

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { argv } from 'node:process';

const __dirname = dirname(fileURLToPath(import.meta.url));

const watch = argv.includes('--watch');

const config = (ssgConfig) => {
  ssgConfig.addWatchTarget('src/pages/**/*.ts', async (target, changeType) => {
    const filePath = join(__dirname, target);

    const result = await renderStatic(filePath);
    const markup = result.markup;
    const htmlFilePath = filePath.replace('.ts', '.html');
    if (markup) {
      await writeFile(htmlFilePath, markup);
    }
  });

  return {
    watch,
  };
};

ssg(config);
