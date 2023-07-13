import { html } from 'lit';
export { layout } from '../layouts/indexLayout.ts';

import '../components/site-nav.ts';

export const title = 'My app • Home';

interface IndexPage {
  title: string;
}
export default async ({ title }: IndexPage) => {
  return html`
    <h1>${title}</h1>
    <site-nav></site-nav>
    <p>Home page</p>
  `;
};
