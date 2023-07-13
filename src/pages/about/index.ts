import { html } from 'lit';

export { layout } from '../../layouts/indexLayout.ts';

import '../../components/site-nav.ts';

export default async () => html`
  <h1>About</h1>
  <site-nav></site-nav>
`;
