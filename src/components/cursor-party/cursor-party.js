import { LitElement, html, css } from 'lit';

import { throttle } from '../../util/throttle.js';

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
    return html` <slot></slot> `;
  }

  _playHighFive = () => {
    console.log('Playing high five! 🔊');
    // const audio = new Audio('/public/audio/high-five.mp3');
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

  _handleMouseMove = throttle(
    /** @param {MouseEvent} event */
    (event) => {
      const { clientX, clientY } = event;
      const newPosition = { x: clientX, y: clientY, timestamp: Date.now() };
      const recentMovements = [
        ...filterForRecency(this._mouseTracker.recentMovements, 500),
        newPosition,
      ];

      this._mouseTracker = {
        position: newPosition,
        recentMovements,
      };

      if (this._mouseIsShaking()) {
        this._isHighFiving = true;
      }
    },
    20
  );

  _mouseIsShaking = () => {
    const { recentMovements } = this._mouseTracker;
    const [first, ...rest] = recentMovements;

    const countAbove = rest.filter((position) => {
      return greaterThan(position, first);
    }).length;

    const countBelow = rest.filter((position) => {
      !greaterThan(position, first);
    }).length;

    const score = Math.abs(countAbove - countBelow) / recentMovements.length;

    if (score > 0.35 && score < 0.65) {
      return true;
    }

    return false;
  };

  static styles = css`
    :host {
      display: block;
      cursor: grab;
    }
  `;
}

customElements.define('cursor-party', CursorParty);

/**
 * @function greaterThan

 * @param {MousePosition} position
 * @param {MousePosition} otherPosition
 * @returns Boolean
 */
function greaterThan(position, otherPosition) {
  return position.x > otherPosition.x || position.y > otherPosition.y;
}

/**
 * @function filterForRecency
 *
 * @param {MousePosition[]} positions
 * @param {Number} threshold in milliseconds
 * @returns
 */
function filterForRecency(positions, threshold) {
  return positions.filter((position) => {
    return position.timestamp > Date.now() - threshold;
  });
}
