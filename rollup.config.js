import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import { rollupPluginHTML as html } from '@web/rollup-plugin-html';
import { generateSW } from 'rollup-plugin-workbox';
import { minify as minifyHTML } from 'html-minifier-terser';

import terser from '@rollup/plugin-terser';
import summary from 'rollup-plugin-summary';
import nodeResolve from '@rollup/plugin-node-resolve';

import { glob } from 'glob';

import path from 'path';
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import cssnanoPlugin from 'cssnano';
import postcssImport from 'postcss-import';

import { renderInThread } from '@hachi-dev/renderer';

export default {
  output: {
    entryFileNames: '[hash].js',
    chunkFileNames: '[hash].js',
    assetFileNames: '[hash][extname]',
    dir: 'build',
    format: 'es',
  },
  plugins: [
    importMetaAssets(),
    html({
      input: await getHTMLInputs(),
      rootDir: __dirname,
      absoluteBaseUrl: 'https://willsonsmith.com',
      minify: false,
      injectServiceWorker: true,
      serviceWorkerPath: 'build/sw.js',
      transformHtml: [
        async (html) =>
          await minifyHTML(html, {
            collapseWhitespace: true,
            minifyCSS: true,
          }),
      ],
      transformAsset: [
        // @ts-ignore
        async (content, filePath) => {
          if (filePath.endsWith('.css')) {
            return (
              await postcss([
                postcssImport(),
                autoprefixer(),
                cssnanoPlugin(),
              ]).process(content, {
                from: filePath,
              })
            ).css;
          }
        },
      ],
    }),
    nodeResolve(),
    terser(),
    generateSW({
      swDest: path.join('build', 'sw.js'),
      globDirectory: path.join('build'),
      globPatterns: ['**/*.{html,js,css,webmanifest}'],
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [{ urlPattern: 'polyfills/*.js', handler: 'CacheFirst' }],
    }),
    summary(),
  ],
};

async function getHTMLInputs() {
  const pageFiles = glob.sync('src/**/*.hachi.js');

  let htmlInputs = [];
  for (const page of pageFiles) {
    const { html: markup } = await renderInThread(join(__dirname, page));
    if (markup) {
      const name = page.replace('src/', '').replace('.hachi.js', '.html');
      htmlInputs.push({
        name: name,
        html: replaceAssetsWithAbsolutePaths(markup),
      });
    }
  }
  return htmlInputs;
}

/**
 *
 * @param {string} html
 * @returns {string}
 */
function replaceAssetsWithAbsolutePaths(html) {
  return html
    .split('\n')
    .map((line) => {
      if (line.includes('file://')) {
        if (line.includes('.js')) {
          return line.replace(pathToFileURL(__dirname).href, __dirname);
        } else {
          return line.replace(pathToFileURL(__dirname).href, '');
        }
      }
      return line;
    })
    .join('\n');
}
