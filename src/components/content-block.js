import { LitElement, html, css } from 'lit';

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
      display: grid;
      gap: var(--size-3);
    }
  `;
}

customElements.define('content-block', ContentBlock);
