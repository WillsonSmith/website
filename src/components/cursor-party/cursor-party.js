import { LitElement, html, css } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import './x-cursor/x-cursor.js';
import './types.js';

import { filterForRecency } from './_util/filter-for-recency.js';
import { cursorIsShaking } from './_util/cursor-is-shaking.js';

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
        cursor => html` <x-cursor color=${cursor.color}></x-cursor> `,
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
