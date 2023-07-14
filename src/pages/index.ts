import { html } from 'lit';
export { layout } from '../layouts/indexLayout.ts';

import '../components/site-header.ts';
import '../components/content-tree.ts';
import '../components/content-block.ts';

export const title = 'My app • Home';

export { styles } from '../styles/indexStyles.ts';

export default async () => {
  return html`
    <site-header>
      <h1 class="site-header__title" slot="title">Willson Smith</h1>
      <img slot="image" src="/public/img/me.png" />
      <div class="social" slot="social">
        <!-- <a href="https://twitter.com/modfox" target="_blank"> Twitter </a> -->
        <a href="https://github.com/willsonsmith" target="_blank"> Github </a>
        <a href="https://www.linkedin.com/in/willsonsmith/" target="_blank">
          Linkedin
        </a>
      </div>
    </site-header>
    <my-element></my-element>
    <main class="primary-column">
      <content-tree>
        <content-block>
          <p>
            Hey! I'm Willson, a developer specializing in front-end web user
            experiences. I was formerly a Creative Technologist at Shopify.
          </p>
        </content-block>
        <content-block>
          <p>
            Coming off of 8 years building front-end at Shopify I'm currently
            taking a break to figure out what's next. I'm always open to new
            opportunities and challenges. If you'd like to chat, feel free to
            <a href="mailto:me@willsonsmith.com">send me an email</a>.
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
