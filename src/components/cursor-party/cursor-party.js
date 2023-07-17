import { LitElement, html, css } from 'lit';

export class CursorParty extends LitElement {
  static properties = {
    _cursors: { type: Array, state: true },
  };

  firstUpdated() {
    this._setupCursorParty();
  }

  disconnectedCallback() {
    this._teardownCursorParty();
  }

  render() {
    return html` <slot></slot> `;
  }

  _setupCursorParty = () => {
    this._setupMouseEvents();
  };

  _teardownCursorParty = () => {
    window.removeEventListener('mousemove', this._handleMouseMove);
  };

  _setupMouseEvents = () => {
    window.addEventListener('mousemove', this._handleMouseMove);
  };

  /**
   *
   * @param {MouseEvent} event
   */
  _handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    console.log(clientX, clientY);
  };

  static styles = css`
    :host {
      display: block;
      cursor: grab;
    }
  `;
}

customElements.define('cursor-party', CursorParty);
