import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('content-tree')
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

    .content-tree::before {
      content: '';
      position: absolute;
      height: 100%;
      width: var(--size-1);
      background-color: var(--gray-8);
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }

    .content-tree > *:nth-child(odd) {
      transform: translateX(var(--size-fluid-4));
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'content-tree': ContentTree;
  }
}
