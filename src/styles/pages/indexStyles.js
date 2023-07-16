import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
  }

  site-header {
    padding-block: var(--size-fluid-1);
    padding-inline: var(--size-fluid-3);
    position: sticky;
    top: 0;

    z-index: 2;
  }

  .site-header__title {
    font-family: 'Lilita One', sans-serif;
    font-size: var(--font-size-5);
    font-weight: var(--font-weight-3);
    line-height: var(--font-lineheight-1);
    margin: 0;
  }

  .site-header__social {
    display: flex;
    gap: var(--size-3);
    align-items: center;
  }

  .home-page {
    display: grid;
    gap: var(--size-4);
  }

  profile-image {
    display: grid;
    justify-content: center;
    position: sticky;
    top: var(--size-3);
  }

  .content-wrapper {
    --triangle-height: var(--size-fluid-8);
    position: relative;
    transform: translateZ(0);
    z-index: 1;

    display: grid;
    grid-template-areas: 'parts';
  }

  .content-background {
    position: sticky;
    top: var(--size-fluid-4);
    grid-area: parts;

    width: 100%;
    height: calc(100vh - var(--size-fluid-4));
    display: grid;
    grid-template-rows: auto 1fr;
  }

  .content-background__color {
    background: hsl(var(--green-3-hsl));
  }

  .content-triangle {
    transform: translateY(1px);
    position: relative;
    display: block;
    width: 100%;
    height: var(--triangle-height);
    fill: hsl(var(--green-3-hsl));
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

  .content > content-block {
    transition: transform 250ms var(--ease-1);
  }

  @media (min-width: 768px) {
    .content > content-block:nth-child(odd) {
      transform: translateX(var(--size-fluid-6));
    }

    .content > content-block:nth-child(even) {
      transform: translateX(calc(-1 * var(--size-fluid-5)));
    }
  }
`;
