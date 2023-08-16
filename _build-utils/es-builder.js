/* eslint-disable */

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import { build as esbuild } from 'esbuild';

import { glob } from 'glob';

import { minifyHTMLLiterals } from 'minify-html-literals';

// const __dirname = dirname(fileURLToPath(import.meta.url));

import { writeFile } from 'fs/promises';

esbuild({
  entryPoints: [...glob.sync('src/**/*.js'), ...glob.sync('src/**/*.ts')],
  bundle: false,
  outdir: 'dist',
  format: 'esm',
  allowOverwrite: true,
  sourcemap: true,
  plugins: [
    {
      name: 'minify-html-templates',
      setup(build) {
        build.onEnd(async () => {
          const htmlFiles = glob.sync('dist/**/*.js');

          for (const htmlFile of htmlFiles) {
            const contents = await readFile(htmlFile, 'utf8');

            const minified = minifyHTMLLiterals(contents);
            if (minified?.code) await writeFile(htmlFile, minified.code);
          }
        });
      },
    },
  ],
  // plugins: [
  //   {
  //     name: 'minify-html-templates',
  //     setup(build) {
  //
  //       // build.onLoad({ filter: /\.ts$/ }, async args => {
  //       //   const contents = await readFile(args.path, 'utf8');
  //       //
  //       //   const minified = minifyHTMLLiterals(contents);
  //       //   if (minified?.code) return { contents: minified.code };
  //       //
  //       //   return { contents };
  //       // });
  //     },
  //   },
  // ],
});
