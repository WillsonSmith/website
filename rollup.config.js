import nodeResolve from '@rollup/plugin-node-resolve';
import { rollupPluginHTML as html } from '@web/rollup-plugin-html';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
// import terser from '@rollup/plugin-terser';
// import { generateSW } from 'rollup-plugin-workbox';

// import typescript from '@rollup/plugin-typescript';

import path from 'path';

export default {
  // input: 'site/pages/**/*.html',
  output: {
    entryFileNames: '[hash].js',
    chunkFileNames: '[hash].js',
    assetFileNames: '[hash][extname]',
    dir: 'dist',
    format: 'es',
  },
  plugins: [
    // typescript(),
    html({
      input: [
        { name: 'index.html', path: 'site/pages/index.html' },
        { name: 'about/index.html', path: 'site/pages/about/index.html' },
      ],
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
