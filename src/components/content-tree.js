import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

// @customElement('content-tree')
export class ContentTree extends LitElement {
  render() {
    return html`
      <div class="content-tree">
        <slot></slot>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .content-tree {
      display: grid;
      gap: var(--size-fluid-4);

      position: relative;
    }
  `;
}

customElements.define('content-tree', ContentTree);

// declare global {
//   interface HTMLElementTagNameMap {
//     'content-tree': ContentTree;
//   }
// }
