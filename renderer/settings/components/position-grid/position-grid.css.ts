import { token, vars } from '@suis-ui/kit/css';
import { style } from '@vanilla-extract/css';

export const positionGrid = style({
  width: '100%',
  minHeight: 'unset',
  aspectRatio: '16 / 9',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gridTemplateRows: 'repeat(3, minmax(0, 1fr))',
  gap: vars.size.space.lg,
});

export const positionIcon = style({
  width: token.size['7'],
  height: token.size['7'],
  objectFit: 'contain',
  alignSelf: 'center',
  justifySelf: 'center',
});
