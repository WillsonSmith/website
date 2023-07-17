import { LitElement, html, css } from 'lit';

import { classMap } from 'lit/directives/class-map.js';

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
      rootMargin: '-50px 0 0 0',
      threshold: [0.85],
    });

    this._observer.observe(this);
  }

  render() {
    return html`
      <div class="profile-image">
        <img
          class=${classMap({
            hello: this.hello,
          })}
          src="/public/img/me.png"
        />
        <img
          class=${classMap({
            hello: !this.hello,
          })}
          src="/public/img/me-bye.png"
        />
      </div>
    `;
  }

  /**
   *
   * @param {IntersectionObserverEntry[]} entries
   * @returns
   */
  #handleIntersection = (entries) => {
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

    @keyframes blob {
      0% {
        border-radius: var(--radius-blob-5);
      }
      25% {
        border-radius: var(--radius-blob-2);
      }
      50% {
        border-radius: var(--radius-blob-3);
      }
      75% {
        border-radius: var(--radius-blob-2);
      }
      100% {
        border-radius: var(--radius-blob-5);
      }
    }
  `;
}

customElements.define('profile-image', ProfileImage);
