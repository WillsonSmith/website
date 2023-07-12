import { ssg, render as renderStatic } from 'ssg';

import { writeFile } from 'fs/promises';

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = (ssgConfig) => {
  ssgConfig.addWatchTarget('site/pages/**/*.js', async (target, changeType) => {
    const filePath = join(__dirname, target);

    const result = await renderStatic(filePath);
    const markup = result.markup;
    const htmlFilePath = filePath.replace('.js', '.html');
    if (markup) {
      await writeFile(htmlFilePath, markup, {});
    }
  });

  return {
    watch: false,
  };
};

ssg(config);
