import { keyframes, style } from '@vanilla-extract/css';

const spin = keyframes({
  to: {
    rotate: '360deg',
  },
});

export const spinnerSvg = style({
  animation: `${spin} 1.4s linear infinite`,
});
