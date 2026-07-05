import { keyframes, style } from '@vanilla-extract/css';

const spin = keyframes({
  to: {
    rotate: '360deg',
  },
});

export const iconSpin = style({
  animation: `${spin} 1s linear infinite`,
});

export const iconRotated = style({
  rotate: '180deg',
});
