import nodeResolve from '@rollup/plugin-node-resolve';

import { rollupPluginHTML as html } from '@web/rollup-plugin-html';
import { minify as htmlMinify } from 'html-minifier-terser';

import terser from '@rollup/plugin-terser';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';

import { generateSW } from 'rollup-plugin-workbox';

import summary from 'rollup-plugin-summary';

/** Keeping around because I will likely need this eventually. */
// import { copy } from '@web/rollup-plugin-copy';

/** This plugin breaks hydration, need to investigate. */
// import { minifyTemplateLiterals } from 'rollup-plugin-minify-template-literals';

import path from 'path';

import { glob } from 'glob';
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import cssnanoPlugin from 'cssnano';
import postcssImport from 'postcss-import';

let htmlInputs = [];

const pageFiles = glob.sync('src/pages/**/*.js');
for (const page of pageFiles) {
  const { markup } = await render(join(__dirname, page));
  if (markup) {
    const markupWithAbsoluteURLs = markup
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

    const name = page.replace('src/pages/', '').replace('.js', '.html');
    htmlInputs.push({
      name: name,
      html: markupWithAbsoluteURLs,
    });
  }
}

import { render } from 'ssg';

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
      input: htmlInputs,
      rootDir: __dirname,
      absoluteBaseUrl: 'https://willsonsmith.com',
      minify: false,
      injectServiceWorker: true,
      serviceWorkerPath: 'build/sw.js',
      transformHtml: [
        async (html) =>
          await htmlMinify(html, {
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
