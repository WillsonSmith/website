import { ssg, render as renderStatic } from 'ssg';

import { writeFile } from 'fs/promises';

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { argv } from 'node:process';

const __dirname = dirname(fileURLToPath(import.meta.url));

const watch = argv.includes('--watch');

import { findDependencies } from '@custom-elements-manifest/find-dependencies';

const config = (ssgConfig) => {
  const dependencyMap = new Map();

  ssgConfig.addWatchTarget('src/pages/**/*.ts', async (target, changeType) => {
    const dependencies = (
      await findDependencies([target], {
        basePath: 'src/pages',
      })
    ).filter((dep) => !dep.includes('node_modules'));
    dependencyMap.set(target, dependencies);

    const filePath = join(__dirname, target);

    const result = await renderStatic(filePath);
    const markup = result.markup;
    const htmlFilePath = filePath.replace('.ts', '.html');
    if (markup) {
      await writeFile(htmlFilePath, markup);
    }
  });

  ssgConfig.addWatchTarget('src/**/*.ts', async (target, changeType) => {
    const fullTargetPath = `${__dirname}/${target}`;
    for (const [page, dependencies] of dependencyMap.entries()) {
      if (dependencies.includes(fullTargetPath)) {
        const filePath = join(__dirname, page);

        const result = await renderStatic(filePath);
        const markup = result.markup;
        const htmlFilePath = filePath.replace('.ts', '.html');
        if (markup) {
          await writeFile(htmlFilePath, markup);
        }
      }
    }
  });

  return {
    watch,
  };
};

ssg(config);
