import { LitElement, html, css, svg, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { customElement, property, state } from 'lit/decorators.js';

import type { Position } from '../_types';

@customElement('v-cursor')
export class VCursor extends LitElement {
  @property({ type: String }) color: string = '#fff';

  @property({ type: Array }) positions: Position[] = [];

  @state() _moving: boolean = false;

  private _movingTimeout?: ReturnType<typeof setTimeout>;

  firstUpdated() {
    document.addEventListener('mousemove', () => {
      this._moving = true;
      clearTimeout(this._movingTimeout);
      this._movingTimeout = setTimeout(() => {
        this._movingTimeout = undefined;
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
      stroke: currentcolor;
      transform: rotate(var(--rotation)) translate(-4px, -4px);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'v-cursor': VCursor;
  }
}
