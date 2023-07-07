import { html } from 'lit';

interface RenderProps {
  title: string;
}

export { template } from './_templates/_default.js';
export const title = 'SSG';
export const render = ({ title }: RenderProps) => {
  return html`<h1>${title}</h1>`;
};
