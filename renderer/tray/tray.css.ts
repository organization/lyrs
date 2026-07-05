import { token, vars } from '@suis-ui/kit/css';
import { style } from '@vanilla-extract/css';

export const menuPanel = style({
  background: `oklch(from ${token.color.gray[950]} l c h / 20%)`,
  borderBottom: `${vars.size.line.thin} solid oklch(from ${token.color.gray[50]} l c h / 10%)`,
  backdropFilter: `blur(${vars.size.space.xl})`,
});

export const segmentGroup = style({
  border: 0,
  margin: 0,
  minInlineSize: 0,
  padding: 0,
});

export const segmentInput = style({
  appearance: 'none',
  width: 0,
  height: 0,
  opacity: 0,
  pointerEvents: 'none',
  position: 'absolute',
});
