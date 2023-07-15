import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

// @customElement('site-nav')
export class MyComponent extends LitElement {
  firstUpdated() {
    // @ts-expect-error
    const active = this.shadowRoot.querySelector(
      `a[href="${window.location.pathname}"]`
    );

    active?.classList.add('active');
  }

  render() {
    return html`
      <nav>
        <a href="/">Home</a>
        <a href="/about.html">about.html</a>
        <a href="/about">About</a>
      </nav>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    nav {
      display: flex;
      gap: var(--size-2);
    }
  `;
}

customElements.define('site-nav', MyComponent);

// declare global {
//   interface HTMLElementTagNameMap {
//     'site-nav': MyComponent;
//   }
// }
