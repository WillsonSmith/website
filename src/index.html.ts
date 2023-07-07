import { html } from 'lit';

import './components/site-nav.js';

interface RenderProps {
  title: string;
}

export { template } from './_templates/_default.js';
export const title = 'SSG';
export const render = ({ title }: RenderProps) => {
  return html`<h1>${title}</h1>
    <site-nav></site-nav>`;
};
