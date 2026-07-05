import { vars } from '@suis-ui/kit/css';
import { style } from '@vanilla-extract/css';

export const dangerButton = style({
  color: vars.color.error.contrast,
  background: vars.color.error.main,
  selectors: {
    '&:hover': {
      background: vars.color.error.high,
    },
  },
});
