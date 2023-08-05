import { LitElement, html, css } from 'lit';

/**
 * @element site-header
 * @prop {String} heading - The site title
 * @cssprop --gap - The gap between the title and social links
 */
export class SiteHeader extends LitElement {
  static properties = {
    heading: { type: String },
  };

  constructor() {
    super();
    this.heading = 'Web page';
  }

  render() {
    return html`
      <header class="site-header">
        <h1 class="site-header-title">${this.heading}</h1>

        <div class="site-header-social">
          <a href="https://github.com/willsonsmith" target="_blank"> Github </a>
          <a href="https://www.linkedin.com/in/willsonsmith/" target="_blank">
            Linkedin
          </a>
        </div>
      </header>
    `;
  }

  static styles = css`
    :host {
      --gap: var(--size-3);
      --font-family-title: 'Lilita One', sans-serif;
      --font-size-title: var(--font-size-5);
      --font-weight-title: var(--font-weight-3);
      --font-lineheight-title: var(--font-lineheight-1);

      display: block;
    }

    a {
      color: inherit;
    }

    .site-header {
      display: grid;
      gap: var(--gap);
      grid-template-areas: 'title social';
      grid-template-columns: 1fr auto;
    }

    .site-header-title {
      grid-area: title;
      font-family: var(--font-family-title);
      font-size: var(--font-size-title);
      font-weight: var(--font-weight-title);
      line-height: var(--font-lineheight-title);
      margin: 0;
    }

    .site-header-social {
      display: flex;
      align-items: center;
      gap: var(--size-3);
    }
  `;
}

customElements.define('site-header', SiteHeader);
