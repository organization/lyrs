import { vars } from '@suis-ui/kit/css';
import { createVar, style } from '@vanilla-extract/css';

export const noScrollbarStyle = style({
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',

  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  }
});

export const x = createVar();
export const y = createVar();
export const fadeSize = createVar();
export const fadeColor = createVar();
export const fadeStyle = style({
  position: 'relative',

  vars: {
    [fadeSize]: vars.size.space.lg,
    [fadeColor]: vars.color.surface.main,
  },

  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: fadeSize,
      background: `linear-gradient(to bottom, ${fadeColor} 0%, oklch(from ${fadeColor} l c h / 0%) 100%)`,
      pointerEvents: 'none',
      translate: `${x} ${y}`,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '100%',
      height: fadeSize,
      background: `linear-gradient(to top, ${fadeColor} 0%, oklch(from ${fadeColor} l c h / 0%) 100%)`,
      pointerEvents: 'none',
      translate: `${x} ${y}`,
    },
  },
});
