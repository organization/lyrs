import { token, vars } from '@suis-ui/kit/css';
import { style } from '@vanilla-extract/css';

export const modalNarrow = style({
  maxWidth: `calc(${token.size['9']} * 7 + ${token.size['4']} + ${vars.size.space.md} + ${vars.size.space.sm})`,
});
