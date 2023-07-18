import { LitElement, html, css } from 'lit';

export class XCursor extends LitElement {
  static properties = {
    color: { type: String },
  };

  constructor() {
    super();
    this.color = '#fff';
  }

  render() {
    return html`
      <div class="cursor">
        <svg
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill=${this.color}
        >
          <path d="m12 2-8 8s5.333-2 8-2 8 2 8 2l-8-8Z" />
          <circle cx="12" cy="13" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      aspect-ratio: 1;
    }

    svg {
      width: 100%;
      height: 100%;
      stroke: currentColor;

      transform: rotate(-45deg);
    }
  `;
}

customElements.define('x-cursor', XCursor);
