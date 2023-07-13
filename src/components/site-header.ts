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
        <div class="site-header__image-wrapper">
          <div class="site-header__image">
            <slot name="image"></slot>
          </div>
        </div>
        <div class="site-header__description">
          <slot></slot>
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
      grid-template-areas: 'title title title' 'image image image' 'description description description';
      gap: var(--size-3);
    }

    .site-header__title {
      grid-area: title;
      display: none;
    }

    .site-header__image-wrapper {
      grid-area: image;
      display: flex;
      justify-content: center;
    }

    .site-header__image {
      max-width: var(--size-12);

      background-image: var(--gradient-14);
      border-radius: var(--radius-blob-2);

      padding: var(--size-2);
    }

    .site-header__description {
      grid-area: description;
      display: flex;
      justify-content: center;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'site-header': SiteHeader;
  }
}
