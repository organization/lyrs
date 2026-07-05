import { vars } from '@suis-ui/kit/css';
import { style } from '@vanilla-extract/css';

const sliderThumbBorderWidth = `calc(${vars.size.line.md} + ${vars.size.line.thick})`;

export const sliderFill = style({
  transformOrigin: 'left',
  scale: 'var(--value) 100%',
});

export const sliderThumb = style({
  border: `${sliderThumbBorderWidth} solid ${vars.color.surface.main}`,
  boxShadow: `0 0 0 ${vars.size.line.md} ${vars.color.surface.higher}`,
});

export const sliderLabel = style({
  fontSize: vars.font.body.fontSize,
  textAlign: 'center',
  translate: '-50% 0',
  pointerEvents: 'none',
});
