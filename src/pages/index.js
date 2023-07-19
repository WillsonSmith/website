import { html, css } from 'lit';

import '../components/cursor-party/cursor-party.js';

import '../components/site-header.js';
import '../components/profile-image.js';
import '../components/pages/home/projects/project-content.js';

import '../components/pages/home/about-content.js';

export { layout } from '../layouts/indexLayout.js';
export const title = 'Willson • Home';

import { styles as indexStyles } from '../styles/pages/indexStyles.js';
export const styles = css`
  ${indexStyles}
`;

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
        <project-content> Projects </project-content>
      </main>
    </div>
  </cursor-party>
`;

export const hydrate = ['./index.js'];
