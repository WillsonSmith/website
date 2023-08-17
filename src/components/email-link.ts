import { LitElement, html, css } from 'lit';

export class EmailLink extends LitElement {
  static properties = {
    _email: { attribute: false },
  };

  _email?: string = undefined;

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

declare global {
  interface HTMLElementTagNameMap {
    'email-link': EmailLink;
  }
}
