import { LitElement, html, css } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { customElement, state } from 'lit/decorators.js';

import type { Cursor } from './_types.js';

import { filterForRecency } from './_util/filter-for-recency.js';
import { cursorIsShaking } from './_util/cursor-is-shaking.js';
import './v-cursor/v-cursor.js';

const MOUSE_MOVE_DELAY = 10;

@customElement('cursor-party')
export class CursorParty extends LitElement {
  @state()
  _cursor: Cursor = {
    color: 'transparent',
    position: { x: 0, y: 0, timestamp: Date.now() },

    history: [],
    state: 'cursor',
  };

  @state()
  _virtualCursors: Cursor[] = [
    {
      color: 'hsl(0 0 100% / 0.3)',
      position: { x: 200, y: 200, timestamp: Date.now() },
      history: [],
      state: 'cursor',
    },
  ];

  @state()
  _isHighFiving = false;

  firstUpdated() {
    this._setupCursorParty();
  }

  disconnectedCallback() {
    this._teardownCursorParty();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('_isHighFiving') && this._isHighFiving) {
      this._playHighFive();
      console.log('High five! 🙌');
    }
  }

  render() {
    return html`
      <slot></slot>

      ${this._virtualCursors.map(
      cursor => html` <v-cursor color=${cursor.color}></v-cursor> `,
    )}
      <div
        class="cursor"
        style=${styleMap({
      '--cursor-x': `${this._cursor.position.x}px`,
      '--cursor-y': `${this._cursor.position.y}px`,
    })}
      >
        <v-cursor
          color=${this._cursor.color}
          .positions=${this._cursor.history}
        ></v-cursor>
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

  _handleMouseMove = (event: MouseEvent) => {
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
    }

    .cursor {
      position: relative;
      z-index: 1000;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cursor-party': CursorParty;
  }
}
