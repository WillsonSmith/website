import { html } from 'lit';
export { layout } from '../layouts/indexLayout.ts';

import '../components/site-nav.js';
import '../components/site-header.js';

export const title = 'My app • Home';

export default async () => {
  return html`
    <site-header>
      <h1 slot="title">Willson</h1>
      <img slot="image" src="/public/img/me.png" />

      <p>
        I'm a software engineer, writer, and maker. I'm currently working on
      </p>
    </site-header>
    <site-nav></site-nav>
    <p>Home page</p>
  `;
};

export const hydrate = [
  '../components/site-nav.js',
  '../components/site-header.js',
];
