import { html, css } from 'lit';

import '../components/site-header.js';
import '../components/profile-image/profile-image.js';
import '../components/pages/home/about-content.js';
import '../components/cursor-party/cursor-party.js';

export { layout } from '../layouts/indexLayout.js';
export const title = 'Willson • Home';

export const metaTags = [
  {
    name: 'description',
    content: 'The personal website of Willson Smith',
  },
];

export const links = [
  {
    rel: 'stylesheet',
    href: '/public/css/index.css',
  },
];

export default () => html`
  <cursor-party>
    <div class="home-page">
      <site-header class="title-bar" title="Willson Smith"></site-header>
      <profile-image class="profile-picture"></profile-image>
      <main>
        <div class="content-wrapper">
          <div class="content-background"></div>
          <about-content class="content"></about-content>
        </div>
      </main>
    </div>
  </cursor-party>
`;

export const hydrate = ['./index.js'];
