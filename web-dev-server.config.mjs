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
  middleware: [trailingSlashMiddleware, hachiIndexMiddleware],
});

async function trailingSlashMiddleware(context, next) {
  if (!context.url.includes('.') && !context.url.endsWith('/')) {
    context.redirect(`${context.url}/`);
  }
  return next();
}

async function hachiIndexMiddleware(context, next) {
  if (context.url.endsWith('/')) {
    const index = glob.sync(join('src', context.url, 'index.hachi.js'))[0];
    if (index) {
      const html = (await renderInThread(join(__dirname, index))).html;
      context.response.body = html;
      context.response.type = 'text/html';
    }
  }
  return next();
}
