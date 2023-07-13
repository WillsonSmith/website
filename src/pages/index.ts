import { html } from 'lit';
export { layout } from '../layouts/indexLayout.ts';

import '../components/site-nav.ts';

export const title = 'My app • Home';

export default async (props: { [key: string]: unknown }) => {
  return html`
    <h1>${props.title}</h1>
    <site-nav></site-nav>
    <p>Home page</p>
  `;
};
