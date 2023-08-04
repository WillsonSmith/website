import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import { rollupPluginHTML } from '@web/rollup-plugin-html';
import { generateSW } from 'rollup-plugin-workbox';
import { minify as minifyHTML } from 'html-minifier-terser';

import terser from '@rollup/plugin-terser';
import summary from 'rollup-plugin-summary';
import nodeResolve from '@rollup/plugin-node-resolve';

import postcss from 'postcss';
import postcssImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';
import cssnanoPlugin from 'cssnano';

import { generateHtmlInputs } from './_build-utils/generate-html-inputs.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
    rollupPluginHTML({
      input: await generateHtmlInputs(),
      rootDir: __dirname,
      absoluteBaseUrl: 'https://willsonsmith.com',
      minify: false,
      injectServiceWorker: true,
      serviceWorkerPath: 'build/sw.js',
      transformHtml: [
        async html =>
          minifyHTML(html, {
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
                postcssPresetEnv(),
                cssnanoPlugin(),
              ]).process(content, {
                from: filePath,
              })
            ).css;
          }
          return content;
        },
      ],
    }),
    nodeResolve(),
    terser(),
    generateSW({
      swDest: join('build', 'sw.js'),
      globDirectory: join('build'),
      globPatterns: ['**/*.{html,js,css,webmanifest}'],
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [{ urlPattern: 'polyfills/*.js', handler: 'CacheFirst' }],
    }),
    summary(),
  ],
};
