import { html, svg } from 'lit';
export { layout } from '../layouts/indexLayout.js';

import '../components/site-header.js';
import '../components/content-tree.js';
import '../components/content-block.js';
import '../components/profile-image.js';

export const title = 'My app • Home';

export { styles } from '../styles/indexStyles/indexStyles.js';

export default async () => {
  return html`
    <div class="page">
      <site-header class="site-header">
        <h1 class="site-header__title" slot="title">Willson Smith</h1>
        <div class="site-header__social" slot="social">
          <a href="https://github.com/willsonsmith" target="_blank"> Github </a>
          <a href="https://www.linkedin.com/in/willsonsmith/" target="_blank">
            Linkedin
          </a>
        </div>
      </site-header>
      <profile-image class="profile-image"></profile-image>
      <div class="content">
        <svg
          class="content__triangle"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polygon points="0,100 100,100 100,0" />
        </svg>

        <div class="content__wrapper">
          <main class="primary-column">
            <content-tree class="content-tree">
              <content-block>
                <span class="micro-heading">Hey! I'm Willson.</span>
                <p>
                  At heart I'm a storyteller and I want others to be able to
                  tell their own stories. I specialize in storytelling front-end
                  web experiences.
                </p>
                <p>
                  Hey! I'm Willson. I'm a developer and I specialize in building
                  front-end web experiences for people.
                </p>
                <p>
                  After ending my 8 years tenure at Shopify I am taking a break
                  to explore new ways to build connections between people.
                </p>

                <p>
                  At Shopify I was a Senior Creative Technologist and acted as a
                  bridge between UX and Engineering to find the balance between
                  what's possible and what's delightful. I also contributed to
                  the Shopify Design System, Polaris, and educated coworkers on
                  its use and best practices.
                </p>
              </content-block>

              <content-block>
                <figure>
                  <blockquote>
                    <p>
                      Fairy tales are more than true: not because they tell us
                      that dragons exist, but because they tell us dragons can
                      be beaten.
                    </p>
                  </blockquote>
                  <figcaption>—Neil Gaiman, <cite>Coraline</cite></figcaption>
                </figure>

                <p>
                  Stories are core to how we understand the world. They help us
                  make sense of the world around us and our place in it. They
                  help us understand the past, present, and future. They help us
                  understand ourselves and others.
                </p>

                <p>
                  Humans are natural storytellers. We tell stories to share
                  knowledge, to teach, to entertain, to persuade, to inspire, to
                  connect, to build empathy, to build community, to build
                  relationships, to build trust, to build understanding, to
                  build meaning, to build identity, to build culture, to build
                  society.
                </p>
              </content-block>
            </content-tree>
          </main>
        </div>
      </div>
    </div>
  `;
};

console.log('Loading page scripts');
export const hydrate = ['./index.js'];
