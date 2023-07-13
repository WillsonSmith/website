import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('site-header')
export class SiteHeader extends LitElement {
  render() {
    return html`
      <header>
        <slot name="title"></slot>
        <slot name="image"></slot>
        <slot></slot>
      </header>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'site-header': SiteHeader;
  }
}
