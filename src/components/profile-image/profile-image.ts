import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { customElement, state } from 'lit/decorators.js';

const thumbsUp = '/src/components/profile-image/img/thumbs-up.png';
const peace = '/src/components/profile-image/img/peace.png';

@customElement('profile-image')
export class ProfileImage extends LitElement {
  @state()
  hello: boolean = true;

  _observer?: IntersectionObserver;

  firstUpdated() {
    this._observer = new IntersectionObserver(this.handleIntersection, {
      rootMargin: '-50px 0px 0px 0px',
      threshold: [0.85],
    });

    this._observer.observe(this);
  }

  render() {
    return html`
      <div class="profile-image">
        <img
          loading="lazy"
          alt="Avatar of Willson smiling and giving a thumbs up to welcome visitors to the website"
          width="420"
          height="420"
          class=${classMap({
            hello: this.hello,
          })}
          src=${thumbsUp}
        />
        <img
          loading="lazy"
          aria-hidden="true"
          alt="Avatar of Willson waving goodbye as the visitor scrolls down the page"
          width="420"
          height="420"
          class=${classMap({
            hello: !this.hello,
          })}
          src=${peace}
        />
      </div>
    `;
  }

  private handleIntersection = (entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      const { isIntersecting } = entry;
      this.hello = isIntersecting;
    }
  };

  static styles = css`
    :host {
      display: block;
    }

    .hello {
      opacity: 1;
    }

    img {
      display: block;
      max-width: 100%;
      height: auto;
      grid-area: image;
      opacity: 0;
      transition: opacity 500ms var(--ease-out-5);
    }

    .profile-image {
      max-width: var(--size-12);
      background-image: var(--gradient-14);
      border-radius: var(--radius-blob-5);
      padding: var(--size-2);
      display: grid;
      grid-template-areas: 'image';
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'profile-image': ProfileImage;
  }
}
