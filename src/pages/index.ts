import { html, css } from 'lit';
export { layout } from '../layouts/indexLayout.ts';

import '../components/site-header.ts';
import '../components/content-tree.ts';
import '../components/content-block.ts';

export const title = 'My app • Home';

export const styles = css`
  body {
    padding-block: var(--size-fluid-1);
  }

  .primary-column {
    max-width: 60ch;

    margin-inline: auto;
    margin-block-start: var(--size-fluid-2);
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
    <main class="primary-column">
      <content-tree>
        <content-block>
          <p>
            lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do
            eiusmod, tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id
          </p>
        </content-block>
        <content-block>
          <p>
            lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do
            eiusmod, tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id
          </p>
        </content-block>
        <content-block>
          <p>
            lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do
            eiusmod, tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id
          </p>
        </content-block>
        <content-block>
          <p>
            lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do
            eiusmod, tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id
          </p>
        </content-block>
      </content-tree>
    </main>
  `;
};
