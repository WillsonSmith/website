// import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';

import { glob } from 'glob';

// import { esbuildPlugin } from '@web/dev-server-esbuild';

import postcss from 'postcss';
import postcssImport from 'postcss-import';

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Use Hot Module replacement by adding --hmr to the start command */
const hmr = process.argv.includes('--hmr');

const rootPath = `src/`;
const pagesPath = `${rootPath}pages/`;

import { renderInThread } from '@hachi-dev/renderer';

import { pathToFileURL } from 'url';

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  open: true,
  rootDir: './',
  watch: !hmr,
  nodeResolve: {
    exportConditions: ['browser'],
  },
  plugins: [
    {
      name: 'replace-file-urls',
      async transform(context) {
        if (context.response.is('html')) {
          // @ts-ignore
          context.body = context.body.replaceAll(
            pathToFileURL(__dirname).href,
            ''
          );
        }
        return context.body;
      },
    },
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
      /**
       * Handle requests for pages.
       * When a request comes in for a page, we need to:
       * 1. Ensure the request is not for a javascript file.
       * 2. Check if an associated index exists for the page.
       * 3. If an index exists, render the page and serve it.
       *
       * There is an additional step to redirect to a trailing slash if the page exists.
       */
      if (!context.url.endsWith('js')) {
        const pathPattern = join(pagesPath, context.url, 'index.js');
        const pageFile = glob.sync(pathPattern)[0];

        if (pageFile) {
          // Redirect to trailing slash
          if (!context.url.endsWith('/')) {
            context.redirect(`${context.url}/`);
          }
          const { html: markup } = await renderInThread(
            join(__dirname, pageFile)
          );
          context.body = markup;
          context.response.type = 'text/html';
        }
      }
      return next();
    },

    async (context, next) => {
      /**
       * When a request for an html file comes in, we need to:
       * 1. Check if an associated javascript file exists for the page.
       * 2. If an index exists, render the page and serve it.
       */
      if (context.url.endsWith('.html')) {
        const pathPattern = join(pagesPath, context.url.replace('html', 'js'));
        const pageFile = glob.sync(pathPattern)[0];
        if (pageFile) {
          const { html: markup } = await renderInThread(
            join(__dirname, pageFile)
          );
          context.body = markup;
          context.response.type = 'text/html';
        }
        // should add a handler to serve actual html pages
      }
      return next();
    },
    async (context, next) => {
      /**
       * If a Javascript file is requested we need to:
       * 1. Check if the file exists in the root directory.
       * 2. If it exists, serve it from its absolute url.
       */
      if (context.url.endsWith('.js')) {
        const javascriptFile = glob.sync(`${rootPath}**/${context.url}`)[0];
        if (javascriptFile) {
          context.url = join('/', javascriptFile);
        }
      }

      return next();
    },
  ],
});
