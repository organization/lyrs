import { vars } from '@suis-ui/kit/css';
import { style } from '@vanilla-extract/css';

export const previewCard = style({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.size.space.xs,
});

export const previewTransition = style({
  width: '100%',
  alignItems: 'flex-end',
});
