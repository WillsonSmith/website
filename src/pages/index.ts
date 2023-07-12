import { html } from 'lit';
export { layout } from '../layouts/indexLayout.js';

import '../components/site-nav.js';

export const title = 'My app • Home';

export default async (props: { [key: string]: unknown }) => {
  return html`
    <h1>${props.title}</h1>
    <site-nav></site-nav>
  `;
};
