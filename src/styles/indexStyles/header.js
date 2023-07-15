import { css } from 'lit';

export const headerStyles = css`
  .site-header {
    padding-block: var(--size-fluid-1);
    padding-inline: var(--size-fluid-3);
    position: sticky;
    top: 0;

    z-index: 2;
  }

  .site-header__title {
    font-family: 'Lilita One', cursive;
    font-size: var(--font-size-5);
    font-weight: var(--font-weight-3);
  }

  .site-header__social {
    display: flex;
    gap: var(--size-3);
    align-items: center;
  }
`;
