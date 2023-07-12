import { html } from 'lit';

export { layout } from '../../layouts/indexLayout.js';

import '../../components/site-nav.js';

export default async (props: { [key: string]: unknown }) => {
  return html`
    <h1>About</h1>
    <site-nav></site-nav>
  `;
};
