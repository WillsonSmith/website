import { html, css } from 'lit';

import '../components/pages/home-page.js';

export { layout } from '../layouts/indexLayout.js';
export const title = 'My app • Home';

export const styles = css`
  @import url('https://fonts.googleapis.com/css2?family=Lilita+One&display=swap');
  body {
    background: hsl(var(--choco-0-hsl));
  }
`;

export default async () => html`<home-page></home-page>`;
export const hydrate = ['./index.js'];
