import { html } from 'lit';

export { layout } from '../../layouts/indexLayout.js';

export default () => {
  return html`
    <div class="projects-page">
      <site-header class="title-bar" title="Willson Smith"></site-header>
      <main>
        <h1>Projects</h1>
      </main>
    </div>
  `;
};
