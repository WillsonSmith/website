import { LitElement, html, css } from 'lit';

export class EmailLink extends LitElement {
  static properties = {
    _email: { type: String, state: true },
  };

  constructor() {
    super();
    /** @type {String | undefined} */
    this._email = undefined;
  }

  firstUpdated() {
    this._email = this.textContent?.replace('[at]', '@');
  }

  render() {
    return this._email
      ? html`<a href="mailto:${this._email}">${this._email}</a>`
      : html` <slot></slot> `;
  }

  static styles = css`
    a {
      color: inherit;
    }
  `;
}

customElements.define('email-link', EmailLink);
