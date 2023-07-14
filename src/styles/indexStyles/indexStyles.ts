import { css } from 'lit';
import { headerStyles } from './header.ts';
import { profileImageStyles } from './profile-image.ts';
import { contentStyles } from './content.ts';

export const styles = css`
  @import url('https://fonts.googleapis.com/css2?family=Lilita+One&display=swap');

  body {
    background: hsl(var(--choco-0-hsl));
  }
  ${headerStyles}
  ${profileImageStyles}
  ${contentStyles}
`;
