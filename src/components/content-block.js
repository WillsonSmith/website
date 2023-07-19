import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

export class ContentBlock extends LitElement {
  static properties = {
    _visible: { type: Boolean, state: true },
  };

  constructor() {
    super();
    this._visible = false;
  }

  firstUpdated() {
    this._observer = new IntersectionObserver(this._handleIntersection, {
      threshold: [0.5],
    });
    this._observer.observe(this);
  }

  render() {
    return html`
      <div
        class=${classMap({
          'content-block': true,
          visible: this._visible,
        })}
        part="content-block"
      >
        <slot></slot>
      </div>
    `;
  }

  _handleIntersection = (
    /** @type {IntersectionObserverEntry[]} */ entries
  ) => {
    for (const entry of entries) {
      const { isIntersecting } = entry;
      this._visible = isIntersecting;
    }
  };

  static styles = css`
    :host {
      display: block;
    }

    .content-block {
      display: grid;
      gap: var(--size-3);
      background: hsl(var(--gray-0-hsl));
      padding: var(--size-4);

      transform: scale(0.98);
      transition:
        transform 250ms var(--ease-out-1),
        box-shadow 300ms var(--ease-1);
    }

    .visible {
      transform: scale(1);
      box-shadow: var(--shadow-2);
    }
  `;
}

customElements.define('content-block', ContentBlock);
