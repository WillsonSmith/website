import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('site-header')
export class SiteHeader extends LitElement {
  render() {
    return html`
      <header class="site-header">
        <div class="site-header__title">
          <slot name="title"></slot>
        </div>
        <div class="site-header__social">
          <slot name="social"></slot>
        </div>
        <div class="site-header__image-wrapper">
          <div class="site-header__image">
            <slot name="image"></slot>
          </div>
        </div>
      </header>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    img {
      display: block;
    }

    .site-header {
      display: grid;
      grid-template-areas: 'title title social' 'image image image';
      gap: var(--size-3);
    }

    .site-header__title {
      grid-area: title;
    }

    .site-header__social {
      grid-area: social;
      display: flex;
      justify-content: flex-end;
    }

    .site-header__image-wrapper {
      grid-area: image;
      display: flex;
      justify-content: center;
    }

    .site-header__image {
      max-width: var(--size-12);

      background-image: var(--gradient-14);
      border-radius: var(--radius-blob-5);

      padding: var(--size-2);

      /* animation: blob 16s infinite linear; */

      /* box-shadow: var(--shadow-2); */
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

declare global {
  interface HTMLElementTagNameMap {
    'site-header': SiteHeader;
  }
}
