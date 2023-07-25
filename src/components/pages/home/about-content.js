import { LitElement, html, css } from 'lit';

import '../../content-block.js';
import '../../email-link.js';

export class AboutContent extends LitElement {
  render() {
    return html`
      <div class="about-content">
        <content-block heading="An introduction.">
          <p>
            Hey! I'm <strong>Willson</strong>, a software developer based in
            Toronto, Canada with a specialization in front-end web experiences.
          </p>

          <p>
            I'm a former Shopify employee of 8 years. Prior to my leave, my
            title was <strong>Senior Creative Technologist</strong>. I wore many
            hats during my time at the company, but they shared a common thread:
            building bridges between people and technology.
          </p>

          <p>
            I was a front-end developer, a ux developer, a creative
            technologist, but through all these roles my goal was simple: build
            delightful, productive, and inclusive experiences for our merchants.
          </p>

          <p>
            In addition to building the front-end Shopify admin experience, some
            of my responsibilities included: working with designers to find the
            balance between possible and perfect, educating my team on the best
            use of and contributing to Shopify's Polaris design system, and
            building prototypes to help communicate ideas.
          </p>
        </content-block>
        <content-block heading="Telling stories with code.">
          <p>
            Stories are integral to the human experience. They are how we make
            sense of the world, how we communicate ideas, how we teach, how we
            learn, and how we remember.
          </p>
          <p>
            I believe that the best user experiences are the ones that tell a
            story. They are the ones that guide you through a journey, they do
            not leave you behind, they do not leave you confused, they do not
            leave you frustrated. They make you promises and they keep them.
          </p>

          <p>
            Stories are also delightful, they are fun, they are engaging, they
            are memorable. They are the experiences we remember, the ones we
            tell our friends about, the ones we come back to. I want to tell
            those stories.
          </p>

          <p></p>
        </content-block>
        <content-block heading="Defeating dragons.">
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
            Shopfiy merchants face dragons every day. They are the dragons of a
            new business, of a new idea, of a new product. The dragons of a new
            market, a new customer, a new competitor. Technology and the world
            around us change every day and adapting to every change while
            building a business is hard. My goal was to provide them with the
            tools to slay their own dragons.
          </p>
        </content-block>

        <content-block heading="Turning the page.">
          <p>
            I've wrapped up my time at Shopify but I am not done building great
            experiences. Front-end development has always foremost been a hobby
            and passion, I take pleasure in building the web. I love it. The
            challenge, the problems I get to solve, the sheer amount of learning
            and creativity to be had.
          </p>
          <p>
            For the time being I'm taking some time for me. I'm learning new
            skills and working on some personal projects and I'm finding new
            ways to connect people, and more ways to tell stories.
          </p>
        </content-block>
        <content-block heading="A new adventure?">
          <p>
            Need a front-end developer? Someone with a keen eye for UX?
            Performance? Accessibility? Have something you think I can help you
            with? I'd love to hear about it.
          </p>
          <p>
            <span>
              Send me an email:
              <email-link> me[at]willsonsmith.com</email-link></span
            >
          </p>
        </content-block>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    strong {
      font-family: 'Lilita One', sans-serif;
    }

    p {
      margin: 0;
      font-size: var(--font-size-1);
      line-height: var(--font-line-height-0);
    }

    figure {
      margin-block: var(--size-fluid-2);
      margin-inline: var(--size-fluid-3);
    }

    figure blockquote {
      margin-block: var(--size-fluid-1);
      margin-inline: var(--size-fluid-3);
    }

    .about-content {
      display: grid;
      gap: var(--size-8);
    }

    content-block {
      transition: transform 250ms var(--ease-1);
      transform: translateX(0) rotate(0);
      transform-origin: 100% 100%;
    }

    @media (min-width: 768px) {
      content-block:nth-child(odd) {
        transform-origin: 100% 100%;
        transform: translateX(var(--size-fluid-6)) rotate(1deg);
      }

      content-block:nth-child(even) {
        transform-origin: 0 100%;
        transform: translateX(calc(-1 * var(--size-fluid-5))) rotate(-1deg);
      }
    }
  `;
}

customElements.define('about-content', AboutContent);
