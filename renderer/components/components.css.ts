import { vars } from '@suis-ui/kit/css';
import { keyframes, style } from '@vanilla-extract/css';

export const layoutRoot = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  overflow: 'hidden',
  color: vars.color.text.main,
  background: vars.color.surface.main,
});

export const layoutBody = style({
  width: '100%',
  minHeight: 0,
  flex: 1,
});

export const cardStack = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: 1,
});

export const card = style({
  position: 'relative',
  width: '100%',
  minHeight: 67,
  display: 'flex',
  alignItems: 'center',
  gap: vars.size.space.md,
  padding: `${vars.size.space.md} ${vars.size.space.lg}`,
  color: vars.color.text.main,
  background: vars.color.surface.high,
  border: 0,
  borderRadius: vars.size.round.sm,
  boxShadow: vars.shadow.xs,
  userSelect: 'none',
  selectors: {
    '&:hover': {
      background: vars.color.surface.higher,
    },
    '&:active': {
      opacity: 0.8,
    },
  },
});

export const cardJustifyBetween = style({
  justifyContent: 'space-between',
});

export const cardJustifyCenter = style({
  justifyContent: 'center',
});

export const cardSubRoot = style({
  borderBottomRightRadius: 0,
  borderBottomLeftRadius: 0,
});

export const cardCollapsedSubRoot = style({
  borderBottomRightRadius: vars.size.round.sm,
  borderBottomLeftRadius: vars.size.round.sm,
});

export const cardChild = style({
  borderRadius: 0,
});

export const cardLastChild = style({
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  borderBottomRightRadius: vars.size.round.sm,
  borderBottomLeftRadius: vars.size.round.sm,
});

export const cardChevron = style({
  width: 16,
  height: 16,
  marginLeft: 'auto',
  color: vars.color.text.main,
});

export const modalOverlay = style({
  position: 'fixed',
  inset: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgb(17 24 39 / 0.4)',
});

export const modalContent = style({
  width: 'fit-content',
  height: 'fit-content',
  maxHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  color: vars.color.text.main,
  background: vars.color.surface.main,
  border: `${vars.size.line.thin} solid ${vars.color.surface.higher}`,
  borderRadius: vars.size.round.sm,
  boxShadow: vars.shadow.xl,
});

export const modalBody = style({
  padding: `${vars.size.space.xl} ${vars.size.space.xxl}`,
  overflow: 'auto',
});

export const modalFooter = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: vars.size.space.sm,
  padding: `${vars.size.space.xl} ${vars.size.space.xxl}`,
  background: vars.color.surface.high,
});

export const dangerButton = style({
  color: vars.color.error.contrast,
  background: vars.color.error.main,
  selectors: {
    '&:hover': {
      background: vars.color.error.high,
    },
  },
});

export const sliderRoot = style({
  position: 'relative',
  minWidth: 120,
  height: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  cursor: 'pointer',
});

export const sliderRootWithLabels = style({
  paddingBottom: 24,
});

export const sliderRail = style({
  position: 'absolute',
  left: 4,
  right: 4,
  height: 4,
  background: vars.color.surface.higher,
  borderRadius: vars.size.round.full,
  zIndex: -2,
});

export const sliderFill = style({
  position: 'absolute',
  left: 4,
  right: 4,
  height: 4,
  background: vars.color.primary.main,
  borderRadius: vars.size.round.full,
  transformOrigin: 'left',
  scale: 'var(--value) 100%',
  zIndex: -1,
});

export const sliderThumb = style({
  width: 16,
  height: 16,
  background: vars.color.primary.main,
  border: `3px solid ${vars.color.surface.main}`,
  borderRadius: vars.size.round.full,
  boxShadow: `0 0 0 1px ${vars.color.surface.higher}`,
  zIndex: 0,
});

export const sliderLabel = style({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  color: vars.color.text.main,
  fontSize: 14,
  textAlign: 'center',
  translate: '-50% 0',
  pointerEvents: 'none',
});

const spin = keyframes({
  to: {
    rotate: '360deg',
  },
});

export const spinnerRoot = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.primary.main,
});

export const spinnerSvg = style({
  animation: `${spin} 1.4s linear infinite`,
});

export const titleBar = style({
  width: '100%',
  height: 40,
  zIndex: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  WebkitUserSelect: 'none',
});

export const titleBarSpacer = style({
  flex: 1,
});

export const titleButton = style({
  width: 44,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.text.caption,
  background: 'transparent',
  border: 0,
  selectors: {
    '&:hover': {
      color: vars.color.text.main,
      background: vars.color.surface.high,
    },
  },
});

export const titleBackButton = style([titleButton, {
  width: 32,
  height: 32,
  marginLeft: vars.size.space.xs,
  borderRadius: vars.size.round.sm,
}]);

export const titleBackButtonMac = style({
  width: 24,
  height: 24,
  marginTop: 4,
  marginLeft: 70,
});

export const iconSmall = style({
  width: 16,
  height: 16,
});

export const iconMedium = style({
  width: 20,
  height: 20,
});
