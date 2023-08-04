import { LitElement, html, css, svg, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

import '../types.js';
import { styleMap } from 'lit/directives/style-map.js';

/**
 *
 *
 * @export
 * @class XCursor
 * @extends {LitElement}
 *
 * @property {String} color
 * @property {Position[]} positions
 * @property {Timeout} _moving
 */
export class VCursor extends LitElement {
  static properties = {
    color: { type: String },
    positions: { type: Array },
    _moving: { type: Object, state: true },
  };

  constructor() {
    super();
    this.color = '#fff';

    /** @type {Position[]} */
    this.positions = [];

    this._moving = false;
  }

  firstUpdated() {
    document.addEventListener('mousemove', () => {
      this._moving = true;
      clearTimeout(this._movingTimeout);
      this._movingTimeout = setTimeout(() => {
        this._movingTimeout = null;
        this._moving = false;
      }, 200);
    });
  }

  render() {
    const radius = 20;
    const piece = this.positions.at(-1);

    const pieces = [
      piece
        ? svg`
        <circle
          style=${styleMap({
            transitionDelay: `50ms`,
            transformOrigin: `${piece.x}px ${piece.y}px`,
          })}
          cx=${piece.x} cy=${piece.y} r=${radius} />
      `
        : nothing,
    ];

    return html`
      <div
        class=${classMap({
          cursor: true,
          moving: this._moving,
        })}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill=${this.color}>
          ${pieces}
        </svg>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      pointer-events: none;
    }

    .cursor {
      position: fixed;
      inset: 0;
    }

    circle {
      opacity: 0;
      transform: scale(1.4);
      transition:
        transform 250ms ease-in,
        opacity 250ms ease-in;
    }

    .moving circle {
      opacity: 1;
      transform: scale(1);
    }

    svg {
      width: 100%;
      height: 100%;
      stroke: currentColor;

      transform: rotate(var(--rotation)) translate(-4px, -4px);
    }
  `;
}

customElements.define('v-cursor', VCursor);
