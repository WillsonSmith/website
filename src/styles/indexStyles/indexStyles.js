import { css } from 'lit';
import { headerStyles } from './header.js';
import { profileImageStyles } from './profile-image.js';
import { contentStyles } from './content.js';

export const styles = css`
  @import url('https://fonts.googleapis.com/css2?family=Lilita+One&display=swap');

  body {
    background: hsl(var(--choco-0-hsl));
  }

  .page {
    display: grid;
    gap: var(--size-5);
  }

  ${headerStyles}
  ${profileImageStyles}
  ${contentStyles}
`;
