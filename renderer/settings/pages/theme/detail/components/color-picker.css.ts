import { token, vars } from '@suis-ui/kit/css';
import { style } from '@vanilla-extract/css';

export const colorPickerRoot = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.size.space.sm,
  marginRight: token.size['-2'],
});

export const colorInput = style({
  width: token.size['5'],
  height: `calc(${vars.size.space.lg} + ${vars.size.space.xxs})`,
  padding: 0,
  background: 'transparent',
  border: 0,
  opacity: 'var(--opacity)',
});

export const alphaSlider = style({
  position: 'relative',
  minWidth: `calc(${token.size['9']} + ${token.size['4']} + ${token.size['3']})`,
  height: token.size['1'],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  cursor: 'pointer',
  zIndex: 0,
});

export const alphaSliderRail = style({
  position: 'absolute',
  left: vars.size.space.xs,
  right: vars.size.space.xs,
  height: vars.size.space.xs,
  background: vars.color.surface.higher,
  borderRadius: vars.size.round.full,
  zIndex: -2,
});

export const alphaSliderFill = style({
  position: 'absolute',
  left: vars.size.space.xs,
  right: vars.size.space.xs,
  height: vars.size.space.xs,
  background: vars.color.primary.main,
  borderRadius: vars.size.round.full,
  transformOrigin: 'left',
  zIndex: -1,
});

export const alphaSliderThumb = style({
  width: token.size['1'],
  height: token.size['1'],
  background: vars.color.primary.main,
  border: `calc(${vars.size.line.thick} + ${vars.size.line.md}) solid ${vars.color.surface.main}`,
  borderRadius: vars.size.round.full,
  boxShadow: `0 0 0 ${vars.size.line.md} ${vars.color.surface.higher}`,
  zIndex: 0,
});
