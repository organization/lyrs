import { token, vars } from '@suis-ui/kit/css';
import { style } from '@vanilla-extract/css';

export const detailList = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: vars.size.space.xs,
  paddingLeft: `calc(${token.size['4']} + ${vars.size.space.sm})`,
});

export const detailRow = style({
  width: '100%',
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: vars.size.space.sm,
});

export const detailKey = style({
  minWidth: `calc(${token.size['9']} * 2)`,
  fontSize: `calc(${vars.font.body.fontSize} + ${vars.size.line.md})`,
});

export const detailValue = style({
  width: '100%',
  minWidth: 0,
  color: vars.color.text.caption,
  fontSize: `calc(${vars.font.body.fontSize} + ${vars.size.line.md})`,
});
