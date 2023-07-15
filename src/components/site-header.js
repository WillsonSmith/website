import { LitElement, html, css } from 'lit';

/**
 * @element site-header
 * @slot title - The site title
 * @slot social - The social links
 * @cssprop --gap - The gap between the title and social links
 */
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
      --gap: var(--size-3);
    }

    img {
      display: block;
    }

    .site-header {
      display: grid;
      grid-template-areas: 'title title social';
      gap: var(--gap);
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

customElements.define('site-header', SiteHeader);
