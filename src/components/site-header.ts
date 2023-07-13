import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('site-header')
export class SiteHeader extends LitElement {
  render() {
    return html`
      <header>
        <slot name="title"></slot>
        <div class="image">
          <slot name="image"></slot>
        </div>
        <slot></slot>
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

    .image {
      max-width: var(--size-12);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'site-header': SiteHeader;
  }
}
