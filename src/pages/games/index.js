import { html, css } from 'lit';

import '../../components/site-header.js';

export { layout } from '../../layouts/indexLayout.js';
export { games } from '../../data/games.js';

export const styles = css`
  site-header {
    position: sticky;
    top: 0;

    padding-inline: var(--size-3);
    padding-block: var(--size-2);
  }
`;

export default async (/** @type {any} */ { games }) => {
  return html`
    <site-header title="Willson • Games"></site-header>
    <h1>Games</h1>
    <ul role="list">
      ${games.map(
        (/** @type {any} */ game) => html`
          <li>
            <a href="${game.website}">
              <img src="${game.header_image}" alt="${game.name}" />
              <h2>${game.name}</h2>
            </a>
          </li>
        `
      )}
    </ul>
  `;
};
