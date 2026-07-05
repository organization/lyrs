import { vars } from '@suis-ui/kit/css';
import { style } from '@vanilla-extract/css';

export const colorPickerRoot = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.size.space.sm,
  marginRight: 6,
});

export const colorInput = style({
  width: 36,
  height: 28,
  padding: 0,
  background: 'transparent',
  border: 0,
  opacity: 'var(--opacity)',
});

export const alphaSlider = style({
  position: 'relative',
  minWidth: 120,
  height: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  cursor: 'pointer',
  zIndex: 0,
});

export const alphaSliderRail = style({
  position: 'absolute',
  left: 4,
  right: 4,
  height: 4,
  background: vars.color.surface.higher,
  borderRadius: vars.size.round.full,
  zIndex: -2,
});

export const alphaSliderFill = style({
  position: 'absolute',
  left: 4,
  right: 4,
  height: 4,
  background: vars.color.primary.main,
  borderRadius: vars.size.round.full,
  transformOrigin: 'left',
  zIndex: -1,
});

export const alphaSliderThumb = style({
  width: 16,
  height: 16,
  background: vars.color.primary.main,
  border: `3px solid ${vars.color.surface.main}`,
  borderRadius: vars.size.round.full,
  boxShadow: `0 0 0 1px ${vars.color.surface.higher}`,
  zIndex: 0,
});
