import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('site-nav')
export class MyComponent extends LitElement {
  render() {
    return html`
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'site-nav': MyComponent;
  }
}
