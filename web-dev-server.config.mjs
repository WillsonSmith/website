// import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';

import { glob } from 'glob';

import { esbuildPlugin } from '@web/dev-server-esbuild';

import postcss from 'postcss';
import postcssImport from 'postcss-import';

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Use Hot Module replacement by adding --hmr to the start command */
const hmr = process.argv.includes('--hmr');

const rootPath = `src/`;
const pagesPath = `${rootPath}pages/`;

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  open: true,
  rootDir: './',
  watch: !hmr,
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },
  plugins: [
    esbuildPlugin({
      ts: true,
      target: 'auto',
    }),
    {
      name: 'postcss',
      async transform(context) {
        if (context.response.is('css')) {
          const postcssResult = await postcss([
            postcssImport(),
            // @ts-ignore
          ]).process(context.body, {
            from: `${__dirname}/${context.url}`,
          });
          //@ts-ignore
          const css = postcssResult.css;
          return css;
        }
      },
    },
    /** Use Hot Module Replacement by uncommenting. Requires @open-wc/dev-server-hmr plugin */
    // hmr && hmrPlugin({ exclude: ['**/*/node_modules/**/*'], presets: [presets.litElement] }),
  ],
  middleware: [
    async (context, next) => {
      const htmlFiles = glob
        .sync(`${pagesPath}**/*.html`)
        .map((file) => file.replace('src/pages', ''));

      if (htmlFiles.includes(context.url)) {
        context.url = `${pagesPath}${context.url}`;
      }

      if (
        context.url === '/' ||
        htmlFiles.includes(`${context.url}/index.html`)
      ) {
        context.url = `${pagesPath}${
          context.url === '/' ? '' : context.url
        }/index.html`;
      }

      // if is js and is 404 then try to find in /site/pages/path
      if (context.url.endsWith('.ts')) {
        const filePath = context.url.replace('.ts', '.html');
        const fileExists = htmlFiles.includes(filePath);
        if (fileExists) {
          context.url = `${pagesPath}${context.url}`;
        }

        const siteJS = glob
          .sync(`${rootPath}**/*.ts`)
          .filter((file) => !file.includes('src/pages'))
          .map((file) => file.replace('src', ''));

        if (siteJS.includes(context.url)) {
          console.log('siteJS', context.url);
          context.url = `/src${context.url}`;
        }
      }

      return next();
    },
  ],
});
