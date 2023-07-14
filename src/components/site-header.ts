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
      grid-template-areas: 'title title social';
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
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'site-header': SiteHeader;
  }
}
