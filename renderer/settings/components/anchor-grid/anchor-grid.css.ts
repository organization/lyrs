import { vars } from '@suis-ui/kit/css';
import { style } from '@vanilla-extract/css';

export const anchorCard = style({
  display: 'flex',
});

export const anchorTop = style({
  alignItems: 'flex-start',
});

export const anchorMiddle = style({
  alignItems: 'center',
});

export const anchorBottom = style({
  alignItems: 'flex-end',
});

export const anchorLeft = style({
  justifyContent: 'flex-start',
});

export const anchorCenter = style({
  justifyContent: 'center',
});

export const anchorRight = style({
  justifyContent: 'flex-end',
});

export const anchorDisabled = style({
  opacity: 0.3,
  background: vars.color.surface.high,
});

export const anchorSelected = style({
  background: vars.color.primary.container,
  selectors: {
    '&:hover': {
      background: vars.color.primary.containerHigh,
    },
  },
});
