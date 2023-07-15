import { css } from 'lit';

export const profileImageStyles = css`
  .profile-image {
    position: sticky;
    top: var(--size-3);
    display: grid;
    place-items: center;

    width: 100%;

    z-index: 0;

    /* animation: blob 16s infinite linear; */
    /* box-shadow: var(--shadow-2); */
  }
`;
