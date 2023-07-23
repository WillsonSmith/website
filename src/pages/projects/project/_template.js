import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

/** @typedef {Object} Hero
 * @property {string} title
 * @property {string} subtitle
 * @property {string} image
 * @property {string} alt
 * @property {string} caption
 */

/** @typedef {Object} Properties
 * @property {string} title
 * @property {string} description
 * @property {string} link
 * @property {Hero} hero
 * @property {string} markdown
 */

/** @param {Properties} props
 * @returns {import('lit').TemplateResult}
 */
export default ({ title, hero, markdown }) => {
  return html`
    <h1>${title}</h1>
    <img src=${hero.image} alt=${title} />
    <div class="project">${unsafeHTML(markdown)}</div>
  `;
};

export const layout = (/** @type {any} */ page) => {
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>${page.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="${page.description}">
        <link rel="stylesheet" href="/public/css/main.css">
      </head>
      <body>
        ${page.content}
      </body>
    </html>
  `;
};
