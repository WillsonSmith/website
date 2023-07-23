const watchForChanges = argv.includes('--watch');

import { render as renderStatic } from 'ssg';

import { readFile, writeFile } from 'fs/promises';

import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { argv } from 'node:process';

const __dirname = dirname(fileURLToPath(import.meta.url));

import { watch } from 'chokidar';
import { glob } from 'glob';
import { findDependencies } from '@custom-elements-manifest/find-dependencies';

import fm from 'front-matter';
import { marked } from 'marked';

if (watchForChanges) {
  const dependencyMap = new Map();

  watch('src/pages/**/*.js').on('all', async (_, path) => {
    const dependencies = await fetchLocalDependencies(path, dirname(path));
    dependencyMap.set(path, dependencies);
    buildPage(path);
  });

  watch('src/**/*.js').on('all', async (_, path) => {
    const fullTargetPath = `${__dirname}/${path}`;
    for (const [page, dependencies] of dependencyMap.entries()) {
      if (dependencies.includes(fullTargetPath)) {
        buildPage(page);
      }
    }
  });
} else {
  glob('src/pages/**/*.js').then(async (files) => {
    for (const file of files) await buildPage(file);
  });

  glob('src/pages/**/*.md').then(async (files) => {
    for (const file of files) {
      const fullFilePath = join(__dirname, file);
      const fileContents = await readFile(fullFilePath, 'utf-8');
      const { attributes, body } = fm(fileContents);
      const html = marked(body, {
        mangle: false,
        headerIds: false,
      });

      const page = join(dirname(fullFilePath), attributes.template);

      try {
        const res = (
          await renderStatic(page, {
            ...attributes,
            markdown: html,
          })
        ).markup;
        await writeFile(fullFilePath.replace('md', 'html'), res);
      } catch (error) {
        console.log(error);
      }
    }
  });
}

async function buildPage(page, options = {}) {
  try {
    const filePath = join(__dirname, page);
    const result = (await renderStatic(filePath, options)).markup;
    if (result) {
      const rootFilePathUrl = pathToFileURL(__dirname);
      await writeFile(
        filePath.replace('js', 'html'),
        result.replaceAll(rootFilePathUrl.href, '')
      );
    }
  } catch (e) {
    console.log('No markup found for', page);
  }
}

async function fetchLocalDependencies(target, basePath) {
  const dependencies = await findDependencies([target], { basePath });
  return dependencies.filter(
    (dependency) => !dependency.includes('node_modules')
  );
}
