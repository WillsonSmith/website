const watchForChanges = argv.includes('--watch');

import { ssg, render as renderStatic } from 'ssg';

import { writeFile } from 'fs/promises';

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { argv } from 'node:process';

const __dirname = dirname(fileURLToPath(import.meta.url));

import { watch } from 'chokidar';
import { glob } from 'glob';
import { findDependencies } from '@custom-elements-manifest/find-dependencies';

if (watchForChanges) {
  const dependencyMap = new Map();

  watch('src/pages/**/*.ts').on('all', async (event, path) => {
    const dependencies = await fetchLocalDependencies(path, dirname(path));
    dependencyMap.set(path, dependencies);
    buildPage(path);
  });

  watch('src/**/*.ts').on('all', async (event, path) => {
    const fullTargetPath = `${__dirname}/${path}`;
    for (const [page, dependencies] of dependencyMap.entries()) {
      if (dependencies.includes(fullTargetPath)) {
        buildPage(page);
      }
    }
  });
} else {
  glob('src/pages/**/*.ts').then((files) => {
    for (const file of files) buildPage(file);
  });
}

async function buildPage(page) {
  const filePath = join(__dirname, page);
  const result = (await renderStatic(filePath)).markup;
  if (result) {
    await writeFile(filePath.replace('ts', 'html'), result);
  }
}

async function fetchLocalDependencies(target, basePath) {
  const dependencies = await findDependencies([target], { basePath });
  return dependencies.filter(
    (dependency) => !dependency.includes('node_modules')
  );
}

// const config = (ssgConfig) => {
//   const dependencyMap = new Map();

//   ssgConfig.addWatchTarget('src/pages/**/*.ts', async (target, changeType) => {
//     const dependencies = (
//       await findDependencies([target], {
//         basePath: 'src/pages',
//       })
//     ).filter((dep) => !dep.includes('node_modules'));
//     dependencyMap.set(target, dependencies);

//     const filePath = join(__dirname, target);

//     const result = await renderStatic(filePath);
//     const markup = result.markup;
//     const htmlFilePath = filePath.replace('.ts', '.html');
//     if (markup) {
//       await writeFile(htmlFilePath, markup);
//     }
//   });

//   ssgConfig.addWatchTarget('src/**/*.ts', async (target, changeType) => {
//     const fullTargetPath = `${__dirname}/${target}`;
//     for (const [page, dependencies] of dependencyMap.entries()) {
//       if (dependencies.includes(fullTargetPath)) {
//         const filePath = join(__dirname, page);

//         const result = await renderStatic(filePath);
//         const markup = result.markup;
//         const htmlFilePath = filePath.replace('.ts', '.html');
//         if (markup) {
//           await writeFile(htmlFilePath, markup);
//         }
//       }
//     }
//   });

//   return {
//     watch: watchForChanges,
//   };
// };

// ssg(config);
