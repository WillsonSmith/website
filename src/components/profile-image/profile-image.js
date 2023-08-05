import { LitElement, html, css } from 'lit';

import { classMap } from 'lit/directives/class-map.js';

const thumbsUp = new URL('./img/thumbs-up.png', import.meta.url).href;
const peace = new URL('./img/peace.png', import.meta.url).href;

export class ProfileImage extends LitElement {
  static get properties() {
    return {
      hello: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.hello = true;
  }

  firstUpdated() {
    this._observer = new IntersectionObserver(this.#handleIntersection, {
      rootMargin: '-50px 0px 0px 0px',
      threshold: [0.85],
    });

    this._observer.observe(this);
  }

  render() {
    return html`
      <div class="profile-image">
        <img
          loading="lazy"
          alt="Avatar of Willson smiling and giving a thumbs up to welcome visitors to the website"
          width="420"
          height="420"
          class=${classMap({
            hello: this.hello,
          })}
          src=${thumbsUp}
        />
        <img
          loading="lazy"
          aria-hidden="true"
          alt="Avatar of Willson waving goodbye as the visitor scrolls down the page"
          width="420"
          height="420"
          class=${classMap({
            hello: !this.hello,
          })}
          src=${peace}
        />
      </div>
    `;
  }

  /**
   *
   * @param {IntersectionObserverEntry[]} entries
   * @returns
   */
  #handleIntersection = entries => {
    for (const entry of entries) {
      const { isIntersecting } = entry;
      this.hello = isIntersecting;
    }
  };

  static styles = css`
    :host {
      display: block;
    }

    .hello {
      opacity: 1;
    }

    img {
      display: block;
      max-width: 100%;
      height: auto;
      grid-area: image;
      opacity: 0;
      transition: opacity 500ms var(--ease-out-5);
    }

    .profile-image {
      max-width: var(--size-12);
      background-image: var(--gradient-14);
      border-radius: var(--radius-blob-5);
      padding: var(--size-2);
      display: grid;
      grid-template-areas: 'image';
    }
  `;
}

customElements.define('profile-image', ProfileImage);
