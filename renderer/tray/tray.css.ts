import { vars } from '@suis-ui/kit/css';
import { style } from '@vanilla-extract/css';

export const menuPanel = style({
  background: 'rgb(0 0 0 / 0.2)',
  borderBottom: `${vars.size.line.thin} solid rgb(255 255 255 / 0.1)`,
  backdropFilter: 'blur(24px)',
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
