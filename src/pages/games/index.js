import { html } from 'lit';

export { layout } from '../../layouts/indexLayout.js';

export { games } from '../../data/games.js';

export default async (/** @type {any} */ { games }) => {
  return html`
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
