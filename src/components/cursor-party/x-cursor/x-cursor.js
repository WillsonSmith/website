import { LitElement, html, css, svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import '../types.js';

/**
 *
 *
 * @export
 * @class XCursor
 * @extends {LitElement}
 *
 * @property {String} color
 * @property {Position[]} positions
 */
export class XCursor extends LitElement {
  static properties = {
    color: { type: String },
    positions: { type: Array },
    _rotation: { type: Number, state: true },
  };

  updated(/** @type {Map<String, unknown>} */ changedProperties) {
    if (changedProperties.has('positions')) {
      this._rotation = 360 - 45;
    }
  }

  constructor() {
    super();
    this.color = '#fff';

    this._rotation = 0;
    this.positions = [];
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
          style=${styleMap({
            '--rotation': `${this._rotation}deg`,
          })}
        >
          ${svg`
          <path d="m12 2-8 8s5.333-2 8-2 8 2 8 2l-8-8Z" />
          <circle cx="12" cy="13" r="2" />
          <circle cx="12" cy="19" r="2" />
          `}
        </svg>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      aspect-ratio: 1;
      pointer-events: none;
    }

    svg {
      width: 100%;
      height: 100%;
      stroke: currentColor;

      transform: rotate(var(--rotation)) translate(-4px, -4px);
    }
  `;
}

customElements.define('x-cursor', XCursor);
