import { css } from 'lit';

export const contentStyles = css`
  .primary-column {
    max-inline-size: min(100%, 60ch);

    margin-inline: auto;
  }
  .primary-column p {
    inline-size: 100%;
  }
  .primary-column p + p {
    margin-top: var(--size-4);
  }

  .content-tree > content-block {
    transition: transform 250ms var(--ease-1);
  }

  @media (min-width: 768px) {
    .content-tree > content-block:nth-child(odd) {
      transform: translateX(var(--size-fluid-6));
    }

    .content-tree > content-block:nth-child(even) {
      transform: translateX(calc(-1 * var(--size-fluid-5)));
    }
  }

  .micro-heading {
    font-family: 'Lilita One', cursive;
    font-size: var(--font-size-4);
    font-weight: var(--font-weight-3);

    line-height: var(--font-lineheight-3);
  }

  .content {
    position: relative;
    transform: translateZ(0);
    z-index: 1;
  }

  .content__triangle {
    position: relative;
    display: block;
    width: 100%;
    height: 200px;
    fill: hsl(var(--green-3-hsl));
  }

  .content__wrapper {
    background: hsl(var(--green-3-hsl));

    padding-block-end: var(--size-3);
  }
`;
