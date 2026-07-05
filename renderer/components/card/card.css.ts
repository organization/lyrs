import { token, vars } from '@suis-ui/kit/css';
import { style } from '@vanilla-extract/css';

export const cardInteractive = style({
  userSelect: 'none',
  selectors: {
    '&:hover': {
      background: vars.color.surface.higher,
    },
    '&:active': {
      opacity: 0.8,
    },
  },
});

export const cardChevron = style({
  width: token.size['1'],
  height: token.size['1'],
  marginLeft: 'auto',
  color: vars.color.text.main,
});
