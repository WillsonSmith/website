import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { classMap } from 'lit/directives/class-map.js';

// @customElement('profile-image')
export class ProfileImage extends LitElement {
  // @property({ type: Boolean }) isHello = true;

  static get properties() {
    return {
      isHello: { type: Boolean },
    };
  }

  firstUpdated() {
    setInterval(() => {
      this.isHello = !this.isHello;
    }, 5000);
  }

  render() {
    return html`
      <div class="profile-image">
        <img
          class=${classMap({
            hello: this.isHello,
          })}
          src="/public/img/me.png"
        />
        <img
          class=${classMap({
            hello: !this.isHello,
          })}
          src="/public/img/me-bye.png"
        />
      </div>
    `;
  }

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

// declare global {
//   interface HTMLElementTagNameMap {
//     'profile-image': ProfileImage;
//   }
// }
