import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
  }

  .title-bar {
    position: sticky;
    top: 0;
    padding-block: var(--size-fluid-1);
    padding-inline: var(--size-fluid-3);

    z-index: 2;
  }

  .home-page {
    display: grid;
    gap: var(--size-4);
  }

  .profile-picture {
    display: grid;
    justify-content: center;
    position: sticky;
    top: var(--size-3);
  }

  .content-wrapper {
    --triangle-height: var(--size-fluid-8);
    position: relative;
    z-index: 1;

    display: grid;
    grid-template-areas: 'parts';
  }

  .content-background {
    grid-area: parts;

    position: sticky;
    top: var(--size-fluid-4);

    display: grid;
    grid-template-rows: 1fr;

    width: 100%;
    height: calc(100vh - var(--size-fluid-4));
    background: hsl(var(--green-3-hsl));

    clip-path: polygon(0 var(--triangle-height), 100% 0, 100% 100%, 0 100%);
  }

  .content {
    position: relative;

    grid-area: parts;

    display: grid;
    gap: var(--size-8);
    justify-content: center;
    grid-template-columns: min(60ch, calc(100% - var(--size-fluid-4)));

    padding-block-start: var(--size-4);
    padding-block-end: var(--size-8);

    margin-top: var(--triangle-height);
  }

  .content-heading {
    font-family: 'Lilita One', cursive;
    font-size: var(--font-size-4);
    font-weight: var(--font-weight-3);
    line-height: var(--font-lineheight-3);
  }

  strong {
    font-family: 'Lilita One', cursive;
  }

  .content > content-block {
    transition: transform 250ms var(--ease-1);
    transform: translateX(0) rotate(0);
    transform-origin: 100% 100%;

    /* box-shadow: var(--shadow-2); */
  }

  @media (min-width: 768px) {
    .content > content-block:nth-child(odd) {
      transform-origin: 100% 100%;
      transform: translateX(var(--size-fluid-6)) rotate(1deg);
    }

    .content > content-block:nth-child(even) {
      transform-origin: 0 100%;
      transform: translateX(calc(-1 * var(--size-fluid-5))) rotate(-1deg);
    }
  }
`;
