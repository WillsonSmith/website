import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('content-block')
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
      --shadow-color: hsl(var(--gray-8-hsl));
      --shadow-offset: 1;
      --shadow-offset-x: var(--shadow-offset);
      --shadow-offset-y: var(--shadow-offset);

      --shadow-size: 7px;

      --shadow-distance-x: calc(var(--shadow-offset-x) * var(--shadow-size));
      --shadow-distance-y: calc(var(--shadow-offset-y) * var(--shadow-size));
    }

    .content-block {
      padding: var(--size-4);
      border: 1px solid black;
      /* box-shadow:
        var(--shadow-distance-x) var(--shadow-distance-y) 0 var(--shadow-color),
        1px 1px 0 var(--shadow-color),
        -1px -1px 0 var(--shadow-color),
        -1px 1px 0 var(--shadow-color),
        1px -1px 0 var(--shadow-color); */
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'content-block': ContentBlock;
  }
}
