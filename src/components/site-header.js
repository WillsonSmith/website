import { LitElement, html, css } from 'lit';

/**
 * @element site-header
 * @slot title - The site title
 * @slot social - The social links
 * @prop {String} title - The site title
 * @cssprop --gap - The gap between the title and social links
 */
export class SiteHeader extends LitElement {
  static properties = {
    title: { type: String },
  };

  render() {
    return html`
      <header class="site-header">
        <h1 class="site-header__title">${this.title}</h1>

        <div class="site-header__social">
          <a href="https://github.com/willsonsmith" target="_blank"> Github </a>
          <a href="https://www.linkedin.com/in/willsonsmith/" target="_blank">
            Linkedin
          </a>
        </div>
        <nav class="site-header__links">
          <a href="/">Home</a>
          <a href="/games">Games</a>
        </nav>
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

      padding-inline: var(--size-3);
      padding-block: var(--size-2);
    }

    a {
      color: inherit;
    }

    .site-header {
      display: grid;
      gap: var(--gap);
      row-gap: var(--size-0);
      grid-template-areas: 'title social' 'links links';
      grid-template-columns: 1fr auto;
    }

    .site-header__title {
      grid-area: title;
      font-family: var(--font-family-title);
      font-size: var(--font-size-title);
      font-weight: var(--font-weight-title);
      line-height: var(--font-lineheight-title);

      margin: 0;
    }

    .site-header__social {
      display: flex;
      align-items: center;
      gap: var(--size-3);
    }

    .site-header__links {
      grid-area: links;
      display: flex;
      gap: var(--size-3);
    }
  `;
}

customElements.define('site-header', SiteHeader);
