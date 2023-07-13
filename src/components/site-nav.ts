import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('site-nav')
export class MyComponent extends LitElement {
  firstUpdated() {
    const active = this.shadowRoot!.querySelector(
      `a[href="${window.location.pathname}"]`
    );

    active?.classList.add('active');
  }

  render() {
    return html`
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about.html">about.html</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
    `;
  }

  static styles = css`
    .active {
      color: red;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'site-nav': MyComponent;
  }
}
