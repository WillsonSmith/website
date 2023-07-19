import { LitElement, html, css } from 'lit';

import { projects } from './projects.js';

export class ProjectContent extends LitElement {
  render() {
    return html`
      <div class="project-content">
        ${projects.map(
          (project) => html`
            <div class="project">
              <h3 class="project__title">${project.title}</h3>
              <p class="project__description">${project.description}</p>
              <a
                class="project__link"
                href="${project.link}"
                target="_blank"
                rel="noopener noreferrer"
                >${project.link}</a
              >
            </div>
          `
        )}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    h3 {
      margin: 0;
    }
  `;
}

customElements.define('project-content', ProjectContent);
