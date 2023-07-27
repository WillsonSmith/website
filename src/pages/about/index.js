import { html } from 'lit';

export { layout } from '../../layouts/indexLayout.js';

export default () => {
  return html`<h1>testAbout</h1>`;
};

export const hydrate = ['./index.js'];
