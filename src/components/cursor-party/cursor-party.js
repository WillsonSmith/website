import { LitElement, html, css } from 'lit';

import { throttle } from '../../util/throttle.js';

const MOUSE_MOVE_DELAY = 10;

/**
 * @typedef {Object} MousePosition
 * @property {Number} x
 * @property {Number} y
 * @property {Number} timestamp
 */

/**
 * @typedef {Object} MouseTracker
 * @property {MousePosition} position
 * @property {MousePosition[]} recentMovements
 */

/**
 * @typedef {Object} Properties
 * @property {MouseTracker} _mouseTracker
 * @property {MousePosition[]} _cursors
 * @property {Boolean} _isHighFiving
 */

export class CursorParty extends LitElement {
  static properties = {
    _mouseTracker: { type: Object, state: true },
    _cursors: { type: Array, state: true },
    _isHighFiving: { type: Boolean, state: true },
  };

  constructor() {
    super();

    /**
     * @type {MouseTracker}
     * @private
     * @memberof CursorParty
     */
    this._mouseTracker = {
      position: { x: 0, y: 0, timestamp: Date.now() },
      recentMovements: [],
    };

    this._isHighFiving = false;
    this._handleMouseMove = throttle(this._handleMouseMove, MOUSE_MOVE_DELAY);

    /**
     * @type {MousePosition[]}
     * @private
     * @memberof CursorParty
     * @description
     * The array of cursors to render.
     */
    this._cursors = [];
  }

  firstUpdated() {
    this._setupCursorParty();
  }

  disconnectedCallback() {
    this._teardownCursorParty();
  }

  /**
   *
   * @param {Map<keyof Properties, Properties[keyof Properties]>} changedProperties
   */
  updated(changedProperties) {
    if (changedProperties.has('_isHighFiving') && this._isHighFiving) {
      this._playHighFive();
      console.log('High five! 🙌');
    }
  }

  render() {
    return html`
      <slot></slot>
      ${this._cursors.map(
        (cursor) => html`
          <div
            class="cursor"
            style="transform: translate3d(${cursor.x}px, ${cursor.y}px, 0);"
          ></div>
        `
      )}
    `;
  }

  _playHighFive = () => {
    console.log('Playing high five! 🔊');
    this._isHighFiving = false;
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
    this._cursors = [newPosition];
    const recentMovements = [
      ...filterForRecency(
        this._mouseTracker.recentMovements,
        MOUSE_MOVE_DELAY * 10
      ),
      newPosition,
    ];

    this._mouseTracker = {
      position: newPosition,
      recentMovements,
    };

    if (this._mouseIsShaking(recentMovements)) {
      this._isHighFiving = true;
    }
  };

  /**
   *
   * @param {MousePosition[]} recentMovements
   * @returns
   */
  _mouseIsShaking = (recentMovements) => {
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

    if (first.y > yMin && first.y < yMax && yMax - yMin > 20) {
      return true;
    }

    if (first.x > xMin && first.x < xMax && xMax - xMin > 20) {
      return true;
    }

    return false;
  };

  static styles = css`
    :host {
      display: block;
      cursor: grab;
    }

    .cursor {
      position: absolute;
      top: 0;
      left: 0;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: hsl(var(--green-12-hsl));

      transition: transform 10ms linear;

      z-index: 1000;
    }
  `;
}

customElements.define('cursor-party', CursorParty);

/**
 * @function filterForRecency
 *
 * @param {MousePosition[]} positions
 * @param {Number} threshold in milliseconds
 * @returns
 */
function filterForRecency(positions, threshold) {
  return positions.filter((position) => {
    return Date.now() - position.timestamp < threshold;
    // return position.timestamp > Date.now() - threshold;
  });
}
