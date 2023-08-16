import { html } from 'lit';

import './components/site-header.js';
import './components/profile-image/profile-image.js';
import './components/pages/home/about-content.js';
import './components/cursor-party/cursor-party.js';

export { layout } from './_layouts/_index.js';
export const title = 'Willson • Home';

export const metaTags = [
  {
    name: 'description',
    content:
      'Willson Smith is a software developer with a specialization in user experience and front-end development from Toronto, Canada. ',
  },
];

export const links = [
  {
    rel: 'stylesheet',
    href: '/src/css/index.css',
  },
];

export default () => html`
  <cursor-party>
    <div class="home-page">
      <site-header class="title-bar" heading="Willson Smith"></site-header>
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

export const hydrate = ['./index.hachi.js'].map(
  asset => new URL(asset, import.meta.url).href,
);
