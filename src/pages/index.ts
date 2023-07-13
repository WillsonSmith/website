import { html, css } from 'lit';
export { layout } from '../layouts/indexLayout.ts';

import '../components/site-nav.ts';
import '../components/site-header.ts';

export const title = 'My app • Home';

export const styles = css`
  .primary-column {
    max-width: 60ch;
  }
  .primary-column p {
    width: 100%;
  }
  .primary-column p + p {
    margin-top: var(--size-4);
  }
`;

export default async () => {
  return html`
    <site-header>
      <h1 slot="title">Willson</h1>
      <img slot="image" src="/public/img/me.png" />

      <p>
        I'm a software engineer, writer, and maker. I'm currently working on
      </p>
    </site-header>
    <site-nav></site-nav>
    <main class="primary-column">
      <p>Home page</p>
      <p>
        lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do eiusmod,
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id
      </p>
      <p>
        lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do eiusmod,
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id
      </p>
      <p>
        lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do eiusmod,
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id
      </p>
      <p>
        lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do eiusmod,
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id
      </p>
      <p>
        lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do eiusmod,
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id
      </p>
    </main>
  `;
};
