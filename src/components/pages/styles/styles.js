import { css } from 'lit';

const headerStyles = css`
  site-header {
    padding-block: var(--size-fluid-1);
    padding-inline: var(--size-fluid-3);
    position: sticky;
    top: 0;

    z-index: 2;
  }

  .site-header__title {
    all: inherit;
    font-family: 'Lilita One', cursive;
    font-size: var(--font-size-5);
    font-weight: var(--font-weight-3);
    margin: 0;
    /* line-height: var(--font-lineheight-3); */
  }

  .site-header__social {
    display: flex;
    gap: var(--size-3);
    align-items: center;
  }
`;

const contentStyles = css`
  .content {
    position: relative;
    transform: translateZ(0);
    z-index: 1;
  }
  .content__triangle {
    transform: translateY(1px);
    position: relative;
    display: block;
    width: 100%;
    height: 200px;
    fill: hsl(var(--green-3-hsl));
  }

  .content__inner {
    background: hsl(var(--green-3-hsl));
    padding-block-start: var(--size-4);
    padding-block-end: var(--size-8);

    display: grid;
    grid-template-columns: min(60ch, 100%);
    justify-content: center;

    gap: var(--size-8);
  }

  .content__inner > content-block {
    transition: transform 250ms var(--ease-1);
  }

  @media (min-width: 768px) {
    .content__inner > content-block:nth-child(odd) {
      transform: translateX(var(--size-fluid-6));
    }

    .content__inner > content-block:nth-child(even) {
      transform: translateX(calc(-1 * var(--size-fluid-5)));
    }
  }

  .micro-heading {
    font-family: 'Lilita One', cursive;
    font-size: var(--font-size-4);
    font-weight: var(--font-weight-3);

    line-height: var(--font-lineheight-3);
  }
`;

export const styles = css`
  :host {
    display: block;
  }

  a {
    color: inherit;
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

  ${headerStyles}
  ${contentStyles}
`;