import { LitElement, html, css, svg } from 'lit';

import { calculateStars } from './calculate-stars.js';

export class StarSheet extends LitElement {
  static properties = {
    _stars: { type: Array, state: true },
  };

  constructor() {
    super();
    /** @type {import('./calculate-stars.js').Star[]} */
    this._stars = [];
  }

  firstUpdated() {
    this._stars = calculateStars(this.clientWidth, this.clientHeight);
  }

  render() {
    return html`<div class="star-sheet">
      <svg>
        ${this._stars.map(
          star => svg`
          <rect
            class="star"
            x="${star.x}%"
            y="${star.y}%"
            width=${star.size}
            height=${star.size}
            fill="white"
            style="animation-delay: ${Math.random() * 5}s;"
          />`,
        )}
      </svg>
    </div>`;
  }

  /**
   * @param {ResizeObserverEntry[]} entries
   */
  _handleResize = entries => {
    const element = entries[0];
    const { width, height } = element.contentRect;
    this._stars = calculateStars(width, height);
  };

  static styles = css`
    :host {
      display: block;
    }

    svg {
      width: 100%;
      height: 100%;
    }

    .star-sheet {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      transition: opacity 500ms var(--ease-out-5);
    }

    .active {
      opacity: 1;
    }

    @keyframes twinkle {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }

    .star {
      opacity: 0;
      animation: twinkle 5s infinite;
    }
  `;
}

customElements.define('star-sheet', StarSheet);
