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
export class XCursor extends LitElement {
  static properties = {
    color: { type: String },
    positions: { type: Array },
    _moving: { type: Object, state: true },
  };

  updated(/** @type {Map<String, unknown>} */ changedProperties) {
    if (changedProperties.has('positions')) {
      clearTimeout(this._moving);

      this._moving = setTimeout(() => {
        this._moving = null;
      }, 100);
    }
  }

  constructor() {
    super();
    this.color = '#fff';

    /** @type {Position[]} */
    this.positions = [];
  }

  render() {
    const max = this.positions.length * 10;
    // const pieces = this.positions.map((position, index) => {
    //   const primaryCursorSize = max - index * 10;
    //   const stepped = index + primaryCursorSize;
    //   return svg`
    //     <circle
    //       style=${styleMap({
    //         transitionDelay: `${index * 10}ms`,
    //         transformOrigin: `${position.x}px ${position.y}px`,
    //       })}
    //       cx=${position.x} cy=${position.y} r=${stepped} />
    //   `;
    // });

    const piece = this.positions.at(-1);
    // const piece = this.positions.at(-1) || { x: 0, y: 0 };

    const pieces = [
      piece
        ? svg`
        <circle
          style=${styleMap({
            transitionDelay: `50ms`,
            transformOrigin: `${piece.x}px ${piece.y}px`,
          })}
          cx=${piece.x} cy=${piece.y} r=${15} />
      `
        : nothing,
    ];

    return html`
      <div
        class=${classMap({
          cursor: true,
          moving: Boolean(this._moving),
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
    /*
    circle:not(:last-of-type) {
      opacity: 0;
      transform: scale(0);
    } */

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

customElements.define('x-cursor', XCursor);
