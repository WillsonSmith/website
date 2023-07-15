import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

// @customElement('content-block')
export class ContentBlock extends LitElement {
  render() {
    return html`
      <div class="content-block" part="content-block">
        <slot></slot>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      background: hsl(var(--gray-0-hsl));
    }

    .content-block {
      padding: var(--size-4);
    }
  `;
}

customElements.define('content-block', ContentBlock);

// declare global {
//   interface HTMLElementTagNameMap {
//     'content-block': ContentBlock;
//   }
// }
