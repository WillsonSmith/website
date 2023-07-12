// import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';

import { glob } from 'glob';

/** Use Hot Module replacement by adding --hmr to the start command */
const hmr = process.argv.includes('--hmr');

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  open: true,
  rootDir: './',
  watch: !hmr,
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },
  plugins: [
    /** Use Hot Module Replacement by uncommenting. Requires @open-wc/dev-server-hmr plugin */
    // hmr && hmrPlugin({ exclude: ['**/*/node_modules/**/*'], presets: [presets.litElement] }),
  ],
  middleware: [
    async (context, next) => {
      const htmlFiles = glob
        .sync('site/pages/**/*.html')
        .map((file) => file.replace('site/pages', ''));

      if (htmlFiles.includes(context.url)) {
        context.url = `/site/pages/${context.url}`;
      }

      if (
        context.url === '/' ||
        htmlFiles.includes(`${context.url}/index.html`)
      ) {
        context.url = `/site/pages/${
          context.url === '/' ? '' : context.url
        }/index.html`;
      }

      return next();
    },
  ],
});
