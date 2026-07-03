import { vars } from '@suis-ui/kit/css';
import { keyframes, style } from '@vanilla-extract/css';

export const navList = style({
  position: 'relative',
  width: 312,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: vars.size.space.xs,
  padding: vars.size.space.lg,
  overflowY: 'auto',
});

export const navIndicator = style({
  position: 'absolute',
  left: vars.size.space.lg,
  top: 10,
  width: 3,
  height: 16,
  background: vars.color.primary.main,
  borderRadius: vars.size.round.full,
  transition: 'all 0.3s cubic-bezier(0.87, 0, 0.13, 1)',
});

export const navIndicatorHidden = style({
  opacity: 0,
  scale: 0,
});

export const navItem = style({
  position: 'relative',
  width: '100%',
  minHeight: 36,
  display: 'flex',
  alignItems: 'center',
  gap: vars.size.space.xs,
  padding: `0 ${vars.size.space.md}`,
  color: vars.color.text.main,
  borderRadius: vars.size.round.sm,
  userSelect: 'none',
  selectors: {
    '&:hover': {
      background: vars.color.surface.high,
      boxShadow: vars.shadow.xs,
    },
    '&:active': {
      background: vars.color.surface.higher,
    },
  },
});

export const navItemSelected = style({
  background: vars.color.surface.high,
});

export const navItemTitle = style({
  marginLeft: vars.size.space.lg,
  fontSize: 15,
});

export const statusCaption = style({
  color: vars.color.text.caption,
});

export const empty = style({
  padding: vars.size.space.xl,
  color: vars.color.text.caption,
  textAlign: 'center',
});

export const hiddenInput = style({
  display: 'none',
});

export const pageRoot = style({
  minWidth: 0,
  minHeight: 0,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: vars.size.space.xs,
  padding: vars.size.space.lg,
  overflowY: 'auto',
});

export const pageRootFlushX = style([pageRoot, {
  paddingRight: 0,
  paddingLeft: 0,
}]);

export const pageTitle = style({
  marginBottom: vars.size.space.xs,
  fontSize: 30,
  lineHeight: 1.2,
});

export const pageTitleRow = style([pageTitle, {
  display: 'flex',
  alignItems: 'center',
  gap: vars.size.space.sm,
  paddingRight: vars.size.space.lg,
  paddingLeft: vars.size.space.lg,
  userSelect: 'none',
}]);

export const pageTitleLink = style({
  opacity: 0.8,
  selectors: {
    '&:hover': {
      opacity: 1,
    },
  },
});

export const sectionTitle = style({
  marginTop: vars.size.space.lg,
  marginBottom: vars.size.space.xs,
  fontSize: 15,
});

export const paddedSectionTitle = style([sectionTitle, {
  paddingRight: vars.size.space.lg,
  paddingLeft: vars.size.space.lg,
}]);

export const sectionStack = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: vars.size.space.xs,
});

export const paddedSectionStack = style([sectionStack, {
  paddingRight: vars.size.space.lg,
  paddingLeft: vars.size.space.lg,
}]);

export const cardRow = style({
  width: '100%',
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: vars.size.space.xs,
});

export const cardRowBetween = style([cardRow, {
  justifyContent: 'space-between',
}]);

export const cardColumn = style({
  width: '100%',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: vars.size.space.xs,
});

export const cardTitle = style({
  fontSize: 15,
});

export const cardCaption = style({
  color: vars.color.text.caption,
  fontSize: 12,
});

export const cardCaptionLarge = style({
  color: vars.color.text.caption,
  fontSize: 15,
});

export const cardDescription = style({
  color: vars.color.text.caption,
  fontSize: 14,
  whiteSpace: 'pre-line',
});

export const spacer = style({
  flex: 1,
});

export const modalTitle = style({
  marginBottom: vars.size.space.sm,
  fontSize: 20,
  lineHeight: 1.3,
});

export const modalBody = style({
  marginBottom: vars.size.space.xs,
  fontSize: 15,
});

export const modalNarrow = style({
  maxWidth: 500,
});

export const unitInput = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.size.space.xs,
});

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
  width: 48,
  height: 48,
  objectFit: 'contain',
  alignSelf: 'center',
  justifySelf: 'center',
});

export const anchorCard = style({
  display: 'flex',
});

export const anchorTop = style({
  alignItems: 'flex-start',
});

export const anchorMiddle = style({
  alignItems: 'center',
});

export const anchorBottom = style({
  alignItems: 'flex-end',
});

export const anchorLeft = style({
  justifyContent: 'flex-start',
});

export const anchorCenter = style({
  justifyContent: 'center',
});

export const anchorRight = style({
  justifyContent: 'flex-end',
});

export const anchorDisabled = style({
  opacity: 0.3,
  background: vars.color.surface.high,
});

export const anchorSelected = style({
  background: vars.color.primary.container,
  selectors: {
    '&:hover': {
      background: vars.color.primary.containerHigh,
    },
  },
});

export const stickyPreview = style({
  position: 'sticky',
  top: -16,
  zIndex: 50,
  marginRight: vars.size.space.lg,
  marginLeft: vars.size.space.lg,
  borderRadius: vars.size.round.md,
  transition: 'all 0.2s ease',
});

export const stickyPreviewRaised = style({
  background: vars.color.surface.high,
  boxShadow: vars.shadow.xl,
});

export const previewBody = style({
  position: 'relative',
  width: '100%',
  maxHeight: 128,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: vars.size.space.lg,
});

export const logPanel = style({
  maxHeight: 400,
  overflowY: 'auto',
});

export const codeBlock = style({
  padding: vars.size.space.md,
  color: '#fff',
  background: '#334155',
  borderRadius: vars.size.round.sm,
  fontFamily: 'monospace',
  whiteSpace: 'pre-wrap',
});

export const iconSmall = style({
  width: 16,
  height: 16,
  flexShrink: 0,
  color: vars.color.text.main,
});

export const iconMedium = style({
  width: 24,
  height: 24,
  flexShrink: 0,
  objectFit: 'contain',
  color: vars.color.text.main,
});

export const avatar = style([iconMedium, {
  borderRadius: vars.size.round.full,
}]);

export const iconSuccess = style({
  color: vars.color.success.main,
});

export const checkPlaceholder = style({
  width: 24,
  height: 24,
  flexShrink: 0,
});

export const rowListModal = style({
  width: '100%',
  maxWidth: 500,
});

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

export const detailList = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: vars.size.space.xs,
  paddingLeft: 40,
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
  minWidth: 128,
  fontSize: 15,
});

export const detailValue = style({
  width: '100%',
  minWidth: 0,
  color: vars.color.text.caption,
  fontSize: 15,
});

export const pluginSummary = style({
  minWidth: 0,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'center',
});

export const pluginNameLine = style({
  width: '100%',
});

export const iconError = style({
  color: vars.color.error.main,
});

const spin = keyframes({
  to: {
    rotate: '360deg',
  },
});

export const iconSpin = style({
  animation: `${spin} 1s linear infinite`,
});

export const iconRotated = style({
  rotate: '180deg',
});

export const gameThemeButtonContent = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

export const pluginLogRoot = style({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: vars.size.space.xs,
  fontFamily: 'monospace',
});

export const pluginLogToken = style({
  overflow: 'visible',
  whiteSpace: 'nowrap',
  fontFamily: 'monospace',
});

export const pluginLogPlugin = style([pluginLogToken, {
  color: vars.color.primary.main,
}]);

export const pluginLogTime = style([pluginLogToken, {
  color: vars.color.primary.main,
}]);

export const pluginLogError = style([pluginLogToken, {
  color: vars.color.error.main,
}]);

export const pluginLogWarn = style([pluginLogToken, {
  color: '#d97706',
}]);

export const pluginLogInfo = style([pluginLogToken, {
  color: '#2563eb',
}]);

export const pluginLogDebug = style([pluginLogToken, {
  color: vars.color.text.caption,
}]);

export const userCssToolbarScroller = style({
  marginTop: 40,
  paddingBottom: vars.size.space.sm,
  overflowX: 'auto',
});

export const userCssToolbar = style({
  minWidth: 750,
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.size.space.xs,
});

export const userCssEditor = style({
  minHeight: 300,
  marginTop: 40,
  overflow: 'hidden',
  borderRadius: vars.size.round.md,
});

export const presetCard = style({
  position: 'relative',
  height: '100%',
  aspectRatio: '1 / 1',
  padding: '0 !important',
  overflow: 'hidden',
  cursor: 'pointer',
  zIndex: 0,
});

export const presetImage = style({
  zIndex: -1,
  selectors: {
    [`${presetCard}:hover &`]: {
      opacity: 0.5,
    },
  },
});

export const presetLabel = style({
  position: 'absolute',
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: vars.size.space.xs,
  padding: vars.size.space.md,
  color: '#fff',
  fontSize: 18,
  background: 'linear-gradient(to top, rgb(0 0 0), rgb(0 0 0 / 0))',
});

export const presetLabelSelected = style({
  color: vars.color.primary.main,
});

export const presetOutline = style({
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  borderRadius: vars.size.round.sm,
  boxShadow: `0 0 0 4px ${vars.color.primary.main} inset`,
  pointerEvents: 'none',
});
