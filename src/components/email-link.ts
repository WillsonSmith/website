import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('email-link')
export class EmailLink extends LitElement {
  @state()
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
