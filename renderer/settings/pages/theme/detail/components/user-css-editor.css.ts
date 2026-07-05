import { token, vars } from '@suis-ui/kit/css';
import { style } from '@vanilla-extract/css';

export const toolbarScroller = style({
  marginTop: `calc(${token.size['4']} + ${vars.size.space.sm})`,
  paddingBottom: vars.size.space.sm,
});

export const toolbar = style({
  minWidth: `calc(${token.size['9']} * 11 + ${token.size['4']} + ${vars.size.space.md} + ${vars.size.line.thick})`,
  width: 'max-content',
  display: 'flex',
  flexWrap: 'nowrap',
  gap: vars.size.space.xs,
});

export const editor = style({
  minHeight: `calc(${token.size['9']} * 4 + ${token.size['4']} + ${vars.size.space.md})`,
  marginTop: `calc(${token.size['4']} + ${vars.size.space.sm})`,
  overflow: 'hidden',
  borderRadius: vars.size.round.md,
});
