import { LitElement, html, css } from 'lit';

import '../../components/site-header.js';

export { layout } from '../../layouts/indexLayout.js';
export { games } from '../../data/games.js';

export const styles = css`
  body {
    background: hsl(var(--gray-12-hsl));
  }
  site-header {
    color: hsl(var(--gray-0-hsl));
    position: sticky;
    top: 0;

    padding-inline: var(--size-3);
    padding-block: var(--size-2);
  }

  .games-wrapper {
    display: grid;
    place-items: center;
  }

  .games-list {
    display: grid;
    /* gap: var(--size-2); */
    /* max-width: 60ch; */
    width: 100%;
    min-width: 0;
  }
`;

export default async (/** @type {any} */ { games }) => {
  const gamesList = games.map((/** @type {any} */ game) => {
    return html`
      <game-showcase
        name=${game.name}
        description=${game.short_description}
        image=${game.header_image}
        website=${game.website}
      ></game-showcase>
    `;
  });

  return html`
    <site-header title="Willson • Games"></site-header>
    <h1>Games</h1>
    <div class="games-wrapper">
      <ul role="list" class="games-list">
        ${gamesList}
      </ul>
    </div>
  `;
};

import { ifDefined } from 'lit/directives/if-defined.js';
class GameShowcase extends LitElement {
  constructor() {
    super();
    this.name = '';
    this.description = '';
    this.image = '';
    /** @type {String | undefined} */
    this.website = undefined;
  }

  static properties = {
    name: { type: String },
    description: { type: String },
    image: { type: String },
    website: { type: String },
  };

  render() {
    return html` <div class="game-showcase" tabindex="0">
      <a href=${ifDefined(this.website)} class="game-showcase__content">
        <h2>${this.name}</h2>
      </a>

      <img class="game-showcase__far-background" src=${this.image} alt="" />
    </div>`;
  }

  static styles = css`
    :host {
      display: block;
    }

    img {
      display: block;
      max-width: 100%;
    }

    .game-showcase {
      position: relative;
      display: grid;
      grid-template-areas: 'main';

      --background-clip: polygon(15% 0, 100% 0, 100% 100%, 15% 100%);
    }

    .game-showcase:focus,
    .game-showcase:hover {
      --background-clip: polygon(100% 0, 100% 0, 100% 100%, 100% 100%);
    }

    .game-showcase__far-background {
      z-index: -1;
      position: relative;
      grid-area: main;
      width: 100%;
      height: 100%;

      object-fit: cover;

      filter: blur(var(--size-fluid-1)) brightness(70%);
    }

    .game-showcase__background {
      position: relative;
      grid-area: main;

      width: 100%;
      height: 100%;

      object-fit: cover;

      clip-path: var(--background-clip);

      transition: clip-path 0.2s ease-in-out;
    }

    .game-showcase__content-wrapper {
      position: relative;
      grid-area: main;

      padding: var(--size-3);

      display: flex;
      align-items: flex-end;
    }

    .game-showcase__content {
      grid-area: main;
      /* border-radius: var(--radius-2); */
      color: hsl(var(--gray-0-hsl));
      box-sizing: border-box;
      max-width: 95%;
      /* background: hsl(var(--gray-0-hsl) / 40%); */
      /* -webkit-backdrop-filter: blur(10px); */
      backdrop-filter: blur(10px);
      padding-inline: var(--size-3);
      padding-block: var(--size-5);

      /* box-shadow: var(--shadow-3); */
    }

    h2 {
      margin: 0;
      font-size: var(--font-size-fluid-2);
    }
    p {
      margin: 0;
    }
  `;
}

customElements.define('game-showcase', GameShowcase);
