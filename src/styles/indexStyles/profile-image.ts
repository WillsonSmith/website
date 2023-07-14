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

  .profile-image__image {
    max-width: var(--size-12);
    background-image: var(--gradient-14);
    border-radius: var(--radius-blob-5);
    padding: var(--size-2);
  }

  @keyframes blob {
    0% {
      border-radius: var(--radius-blob-5);
    }
    25% {
      border-radius: var(--radius-blob-2);
    }
    50% {
      border-radius: var(--radius-blob-3);
    }
    75% {
      border-radius: var(--radius-blob-2);
    }
    100% {
      border-radius: var(--radius-blob-5);
    }
  }
`;
