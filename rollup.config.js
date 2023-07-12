import nodeResolve from '@rollup/plugin-node-resolve';
import { rollupPluginHTML as html } from '@web/rollup-plugin-html';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import terser from '@rollup/plugin-terser';
import { generateSW } from 'rollup-plugin-workbox';

// import typescript from '@rollup/plugin-typescript';

import path from 'path';

import { glob } from 'glob';

import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import cssnanoPlugin from 'cssnano';

const htmlFiles = glob.sync('site/pages/**/*.html').map((file) => {
  return {
    name: file.replace('site/pages/', ''),
    path: file,
  };
});

export default {
  // input: 'site/pages/**/*.html',
  output: {
    entryFileNames: '[hash].js',
    chunkFileNames: '[hash].js',
    assetFileNames: '[hash][extname]',
    dir: 'build',
    format: 'es',
  },
  plugins: [
    // typescript(),
    html({
      input: htmlFiles,
      minify: true,
      injectServiceWorker: true,
      serviceWorkerPath: 'build/sw.js',
      transformAsset: [
        // @ts-ignore
        async (content, filePath) => {
          if (filePath.endsWith('.css')) {
            return (
              await postcss([autoprefixer, cssnanoPlugin]).process(content)
            ).css;
          }
        },
      ],
    }),
    nodeResolve(),
    terser(),
    importMetaAssets(),
    generateSW({
      swDest: path.join('build', 'sw.js'),
      globDirectory: path.join('build'),
      globPatterns: ['**/*.{html,js,css,webmanifest}'],
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [{ urlPattern: 'polyfills/*.js', handler: 'CacheFirst' }],
    }),
  ],
};
