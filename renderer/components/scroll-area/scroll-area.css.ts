import { token, vars } from '@suis-ui/kit/css';
import { createVar, style } from '@vanilla-extract/css';

const scrollbarThumbColor = `oklch(from ${vars.color.text.main} l c h / 35%)`;
const scrollbarTrackColor = `oklch(from ${vars.color.text.main} l c h / 10%)`;
const opaqueMask = 'rgb(0 0 0 / 100%)';
const transparentMask = 'rgb(0 0 0 / 0%)';

export const scrollbarBaseStyle = style({
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',

  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
      width: 0,
      height: 0,
    },
  },
});

export const x = createVar();
export const y = createVar();
export const fadeSize = createVar();
export const fadeColor = createVar();
export const scrollbarOpacity = createVar();
export const scrollAreaStyle = style({
  position: 'relative',

  vars: {
    [x]: '0px',
    [y]: '0px',
    [fadeSize]: vars.size.space.lg,
    [fadeColor]: vars.color.surface.main,
    [scrollbarOpacity]: '0',
  },
});

export const scrollbarHoverStyle = style({
  selectors: {
    '&:hover, &:focus-within': {
      vars: {
        [scrollbarOpacity]: '1',
      },
    },
  },
});

export const scrollbarAlwaysStyle = style({
  vars: {
    [scrollbarOpacity]: '1',
  },
});

export const scrollbarHiddenStyle = style({
  vars: {
    [scrollbarOpacity]: '0',
  },
});

const scrollbarTrackBase = style({
  position: 'absolute',
  zIndex: 2,
  opacity: scrollbarOpacity,
  overflow: 'hidden',
  pointerEvents: 'auto',
  touchAction: 'none',
  transition: 'opacity 0.16s ease',
  translate: `${x} ${y}`,
  userSelect: 'none',
  borderRadius: vars.size.round.md,
  backgroundColor: scrollbarTrackColor,
});

export const verticalScrollbarTrack = style([
  scrollbarTrackBase,
  {
    top: vars.size.space.xs,
    right: vars.size.space.xs,
    bottom: vars.size.space.xs,
    width: token.size['-3'],
  },
]);

export const horizontalScrollbarTrack = style([
  scrollbarTrackBase,
  {
    right: vars.size.space.xs,
    bottom: vars.size.space.xs,
    left: vars.size.space.xs,
    height: token.size['-3'],
  },
]);

export const scrollbarThumb = style({
  position: 'absolute',
  top: 0,
  left: 0,
  borderRadius: vars.size.round.md,
  backgroundColor: scrollbarThumbColor,
  cursor: 'grab',

  selectors: {
    '&:active': {
      cursor: 'grabbing',
    },
  },
});

const shadeBase = style({
  position: 'absolute',
  zIndex: 1,
  opacity: 0,
  pointerEvents: 'none',
  transition: 'opacity 0.16s ease',
  translate: `${x} ${y}`,
});
const shadeMaskBase = {
  background: fadeColor,
  maskRepeat: 'no-repeat',
  maskSize: '100% 100%',
  WebkitMaskRepeat: 'no-repeat',
  WebkitMaskSize: '100% 100%',
};

export const shadeVisible = style({
  opacity: 1,
});

export const topShade = style([
  shadeBase,
  {
    top: 0,
    left: 0,
    width: '100%',
    height: fadeSize,
    ...shadeMaskBase,
    maskImage: `linear-gradient(to bottom, ${opaqueMask} 0%, ${transparentMask} 100%)`,
    WebkitMaskImage: `linear-gradient(to bottom, ${opaqueMask} 0%, ${transparentMask} 100%)`,
  },
]);

export const bottomShade = style([
  shadeBase,
  {
    bottom: 0,
    left: 0,
    width: '100%',
    height: fadeSize,
    ...shadeMaskBase,
    maskImage: `linear-gradient(to top, ${opaqueMask} 0%, ${transparentMask} 100%)`,
    WebkitMaskImage: `linear-gradient(to top, ${opaqueMask} 0%, ${transparentMask} 100%)`,
  },
]);

export const leftShade = style([
  shadeBase,
  {
    top: 0,
    left: 0,
    width: fadeSize,
    height: '100%',
    ...shadeMaskBase,
    maskImage: `linear-gradient(to right, ${opaqueMask} 0%, ${transparentMask} 100%)`,
    WebkitMaskImage: `linear-gradient(to right, ${opaqueMask} 0%, ${transparentMask} 100%)`,
  },
]);

export const rightShade = style([
  shadeBase,
  {
    top: 0,
    right: 0,
    width: fadeSize,
    height: '100%',
    ...shadeMaskBase,
    maskImage: `linear-gradient(to left, ${opaqueMask} 0%, ${transparentMask} 100%)`,
    WebkitMaskImage: `linear-gradient(to left, ${opaqueMask} 0%, ${transparentMask} 100%)`,
  },
]);
