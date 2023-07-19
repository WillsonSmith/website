import { html, css } from 'lit';

import '../components/cursor-party/cursor-party.js';

import '../components/site-header.js';
import '../components/profile-image.js';
import '../components/content-block.js';

export { layout } from '../layouts/indexLayout.js';
export const title = 'Willson • Home';

import { styles as indexStyles } from '../styles/pages/indexStyles.js';
export const styles = css`
  @import url('https://fonts.googleapis.com/css2?family=Lilita+One&display=swap');
  body {
    background: hsl(var(--choco-0-hsl));
  }
  ${indexStyles}
`;

export default () => html`
  <cursor-party>
    <div class="home-page">
      <site-header class="title-bar" title="Willson Smith"></site-header>

      <profile-image class="profile-picture"></profile-image>

      <div class="content-wrapper">
        <div class="content-background"></div>
        <main class="content">
          <content-block>
            <span class="content-heading">An introduction.</span>
            <p>
              Hey! I'm <strong>Willson</strong>, a developer with a
              specialization in front-end web experiences.
            </p>

            <p>
              I have recently ended my time at Shopify after 8 years. Prior to
              my leave, I was a <em>Senior Creative Technologist</em>. I wore
              many hats during my time at the company, but they shared a common
              thread, to build bridges between people and technology.
            </p>

            <p>
              I was a front-end developer, a ux developer, a creative
              technlogist, but through all these roles my goal was simple: build
              delightful, accessible, and inclusive experiences for our
              merchants.
            </p>

            <p>
              In addition to building the front-end Shopify admin experience,
              some of my responsibilities included: Working with designers to
              find the balance between possible and perfect, educating my team
              on the best use of Shopify's Polaris design system, and building
              prototypes to help communicate ideas.
            </p>
          </content-block>
          <content-block>
            <span class="content-heading">Defeating dragons.</span>
            <figure style="margin-block-start: 0">
              <blockquote>
                <p>
                  Fairy tales are more than true: not because they tell us that
                  dragons exist, but because they tell us dragons can be beaten.
                </p>
              </blockquote>
              <figcaption>—Neil Gaiman, <cite>Coraline</cite></figcaption>
            </figure>

            <p>
              Fiary tales show us dragons can be defeated, well crafted user
              experiences show us that difficult tasks are surmountable.
            </p>

            <p>
              Shopfiy merchants face dragons every day. They are the dragons of
              a new business, of a new idea, of a new product. The dragons of a
              new market, a new customer, a new competitor. Technology and the
              world around us change every day and adapting to every change
              while building a business is hard. My goal was to provide them
              with the tools to slay those dragons.
            </p>
          </content-block>

          <content-block>
            <span class="content-heading">What's happening now?</span>
            <p>
              I'm taking some time for me these days. I'm learning new skills
              and working on some personal projects.
            </p>

            <p>I want to tell stories.</p>
          </content-block>
          <content-block>
            <span class="content-heading">A new adventure.</span>
          </content-block>
        </main>
      </div>
    </div>
  </cursor-party>
`;

export const hydrate = ['./index.js'];
