import { LitElement, html, css, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import { throttle } from '../../util/throttle.js';

import './x-cursor/x-cursor.js';
import './types.js';

const MOUSE_MOVE_DELAY = 10;

/**
 *
 * @export
 * @class CursorParty
 * @extends {LitElement}
 *
 * @property {Cursor} _cursor
 * @property {Position[]} _virtualCursors
 * @property {Boolean} _isHighFiving
 */
export class CursorParty extends LitElement {
  static properties = {
    _cursor: { type: Object, state: true },
    _virtualCursors: { type: Array, state: true },
    _isHighFiving: { type: Boolean, state: true },
  };

  constructor() {
    super();
    this._isHighFiving = false;

    /** @type {Cursor} */
    this._cursor = {
      color: 'transparent',
      position: { x: 0, y: 0, timestamp: Date.now() },

      history: [],
      state: 'cursor',
    };

    this._virtualCursors = [
      {
        color: 'hsl(0 0 100% / 0.3)',
        position: { x: 200, y: 200, timestamp: Date.now() },
        history: [],
        state: 'cursor',
      },
    ];
  }

  firstUpdated() {
    this._setupCursorParty();
  }

  disconnectedCallback() {
    this._teardownCursorParty();
  }

  updated(/** @type Map<string, unknown> */ changedProperties) {
    if (changedProperties.has('_isHighFiving') && this._isHighFiving) {
      this._playHighFive();
      console.log('High five! 🙌');
    }
  }

  render() {
    return html`
      <slot></slot>

      ${this._virtualCursors.map(
        (cursor) => html` <x-cursor color=${cursor.color}></x-cursor> `
      )}
      <div
        class="cursor"
        style=${styleMap({
          '--cursor-x': `${this._cursor.position.x}px`,
          '--cursor-y': `${this._cursor.position.y}px`,
        })}
      >
        <x-cursor
          color=${this._cursor.color}
          .positions=${this._cursor.history}
        ></x-cursor>
      </div>
    `;
  }

  _playHighFive = () => {
    console.log('Playing high five! 🔊');

    // tie to audio
    setTimeout(() => {
      this._isHighFiving = false;
    }, 1000);
  };

  _setupCursorParty = () => {
    this._setupMouseEvents();
  };

  _teardownCursorParty = () => {
    window.removeEventListener('mousemove', this._handleMouseMove);
  };

  _setupMouseEvents = () => {
    window.addEventListener('mousemove', this._handleMouseMove);
  };

  _handleMouseMove = (/** @type {MouseEvent} */ event) => {
    const { clientX, clientY } = event;
    const newPosition = { x: clientX, y: clientY, timestamp: Date.now() };

    this._cursor = {
      ...this._cursor,
      position: newPosition,
      history: [...this._cursor.history, newPosition].slice(-10),
    };

    const recentMovements = [
      ...filterForRecency(this._cursor.history, MOUSE_MOVE_DELAY * 10),
      newPosition,
    ];

    if (cursorIsShaking(recentMovements)) {
      this._isHighFiving = true;
    }
  };

  static styles = css`
    :host {
      display: block;
      /* cursor: none; */
    }

    .cursor {
      position: relative;
      z-index: 1000;
    }
  `;
}

customElements.define('cursor-party', CursorParty);

/**
 * @function filterForRecency
 *
 * @param {Position[]} positions
 * @param {Number} threshold in milliseconds
 * @returns
 */
function filterForRecency(positions, threshold) {
  return positions.filter((position) => {
    return Date.now() - position.timestamp < threshold;
  });
}

/**
 * @function mouseIsShaking
 *
 * @param {Position[]} recentMovements
 * @returns
 */

const cursorIsShaking = throttle(
  /**
   *
   * @param {Position[]} recentMovements
   * @returns
   */
  function cursorIsShaking(recentMovements) {
    const [first, ...rest] = recentMovements;

    let [xMax, xMin, yMax, yMin] = [first.x, first.x, first.y, first.y];
    for (const position of rest) {
      if (position.y < yMin) {
        yMin = position.y;
      }
      if (position.y > yMax) {
        yMax = position.y;
      }
      if (position.x < xMin) {
        xMin = position.x;
      }
      if (position.x > xMax) {
        xMax = position.x;
      }
    }

    if (first.y > yMin && first.y < yMax && yMax - yMin > 50) {
      return true;
    }

    if (first.x > xMin && first.x < xMax && xMax - xMin > 50) {
      return true;
    }

    return false;
  },
  100
);
