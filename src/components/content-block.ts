import { LitElement, html, css, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

export class ContentBlock extends LitElement {
  heading: string | undefined;

  _visible: boolean = false;

  static properties = {
    heading: { type: String, attribute: 'heading' },
    _visible: { attribute: false, state: true },
  };

  _observer?: IntersectionObserver = undefined;

  firstUpdated() {
    this._observer = new IntersectionObserver(this._handleIntersection, {
      threshold: [0.5],
    });
    this._observer.observe(this);
  }

  render() {
    return html`
      <section
        class=${classMap({
      'content-block': true,
      visible: this._visible,
    })}
        part="content-block"
      >
        ${this.heading
        ? html`<h2 class="content-block-heading" part="title">
              ${this.heading}
            </h2>`
        : nothing}
        <slot></slot>
      </section>
    `;
  }

  _handleIntersection = (entries: IntersectionObserverEntry[]) => {
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
      border-radius: var(--radius-2);
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

    .content-block-heading {
      margin: 0;
      font-family: 'Lilita One', sans-serif;
      font-size: var(--font-size-4);
      font-weight: var(--font-weight-3);
      line-height: var(--font-lineheight-3);
    }
  `;
}

customElements.define('content-block', ContentBlock);

declare global {
  interface HTMLElementTagNameMap {
    'content-block': ContentBlock;
  }
}
