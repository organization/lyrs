import { vars } from '@suis-ui/kit/css';
import { style } from '@vanilla-extract/css';

export const toolbarScroller = style({
  marginTop: 40,
  paddingBottom: vars.size.space.sm,
  overflowX: 'auto',
});

export const toolbar = style({
  minWidth: 750,
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.size.space.xs,
});

export const editor = style({
  minHeight: 300,
  marginTop: 40,
  overflow: 'hidden',
  borderRadius: vars.size.round.md,
});
