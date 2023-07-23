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

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  open: true,
  rootDir: './',
  watch: !hmr,
  // watch: false,
  nodeResolve: {
    exportConditions: ['browser'],
  },
  plugins: [
    // esbuildPlugin({
    //   target: 'es2022',
    // }),
    {
      name: '',
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
      // Find all .ts files in the src directory and add them to the context
      const javascriptSourceFiles = glob.sync(`${rootPath}**/*.js`);
      context.javascriptSourceFiles = javascriptSourceFiles.filter(
        (source) => !source.includes('src/pages')
      );

      // Find all .html files in the src/pages directory and add them to the context
      const htmlFiles = glob
        .sync(`${pagesPath}**/*.html`)
        .map((file) => file.replace('src/pages', ''));
      context.htmlFiles = htmlFiles;

      return next();
    },
    async (context, next) => {
      // Redirect requests that have an html file
      if (context.htmlFiles.includes(context.url)) {
        context.url = `${pagesPath}${context.url}`;
      }
      return next();
    },

    async (context, next) => {
      // Redirect site index
      if (context.url === '/') {
        context.url = `${pagesPath}index.html`;
      }
      return next();
    },

    async (context, next) => {
      // Redirect trailing slash to path plus index.html
      if (context.htmlFiles.includes(`${context.url}/index.html`)) {
        context.url = `${pagesPath}${context.url}/index.html`;
      }
      return next();
    },

    async (context, next) => {
      // redirect page javascript requests
      if (context.url.endsWith('js')) {
        const filePath = context.url.replace('.js', '.html');
        const fileExists = context.htmlFiles.includes(filePath);
        if (fileExists) {
          context.url = `${pagesPath}${context.url}`;
        }
      }
      return next();
    },
    async (context, next) => {
      const normalizedJsPaths = context.javascriptSourceFiles.map((path) =>
        path.replace('src', '')
      );
      if (normalizedJsPaths.includes(context.url)) {
        context.url = `/src${context.url}`;
      }
      return next();
    },
  ],
});
