import { css } from 'lit';

export const styles = css`
  @import url('https://fonts.googleapis.com/css2?family=Lilita+One&display=swap');

  body {
    padding-block-end: var(--size-fluid-1);
    background: hsl(var(--choco-0-hsl));
  }

  site-header {
    padding-block: var(--size-fluid-1);
    padding-inline: var(--size-fluid-3);
    position: sticky;
    top: 0;
  }

  .site-header__title {
    font-family: 'Lilita One', cursive;
    font-size: var(--font-size-5);
    font-weight: var(--font-weight-3);
  }

  .social {
    display: flex;
    gap: var(--size-3);

    align-items: center;
  }

  .primary-column {
    max-width: 60ch;

    margin-inline: auto;
    margin-block-start: var(--size-fluid-2);
  }
  .primary-column p {
    width: 100%;
  }
  .primary-column p + p {
    margin-top: var(--size-4);
  }
`;
