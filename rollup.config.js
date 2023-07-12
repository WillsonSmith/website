import nodeResolve from '@rollup/plugin-node-resolve';
import { rollupPluginHTML as html } from '@web/rollup-plugin-html';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
// import terser from '@rollup/plugin-terser';
// import { generateSW } from 'rollup-plugin-workbox';

// import typescript from '@rollup/plugin-typescript';

import path from 'path';

import { glob } from 'glob';

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
      // injectServiceWorker: true,
      // serviceWorkerPath: 'dist/sw.js',
    }),
    nodeResolve(),
    // terser(),
    importMetaAssets(),
    // generateSW({
    //   swDest: path.join('dist', 'sw.js'),
    //   globDirectory: path.join('dist'),
    //   globPatterns: ['**/*.{html,js,css,webmanifest}'],
    //   skipWaiting: true,
    //   clientsClaim: true,
    //   runtimeCaching: [{ urlPattern: 'polyfills/*.js', handler: 'CacheFirst' }],
    // }),
  ],
};
