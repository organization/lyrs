import { vars } from '@suis-ui/kit/css';
import { style } from '@vanilla-extract/css';

export const appRoot = style({
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  color: vars.color.text.main,
  background: vars.color.surface.main,
});

export const menuPanel = style({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.size.space.lg,
  padding: `4rem ${vars.size.space.lg} ${vars.size.space.lg}`,
  background: 'rgb(0 0 0 / 0.2)',
  borderBottom: `${vars.size.line.thin} solid rgb(255 255 255 / 0.1)`,
  backdropFilter: 'blur(24px)',
});

export const segmentGroup = style({
  display: 'flex',
  gap: vars.size.space.xs,
  border: 0,
  padding: 0,
  margin: 0,
});

export const segmentItem = style({
  flex: 1,
  padding: vars.size.space.xs,
  color: vars.color.text.main,
  textAlign: 'center',
  borderRadius: vars.size.round.sm,
  background: vars.color.surface.high,
  selectors: {
    '&:hover': {
      background: vars.color.surface.higher,
    },
  },
});

export const segmentItemSelected = style({
  color: vars.color.primary.containerContrast,
  background: vars.color.primary.container,
});

export const segmentInput = style({
  appearance: 'none',
});

export const delayPanel = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.size.space.lg,
});

export const delaySliderGroup = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.size.space.xs,
});

export const delayLabels = style({
  display: 'flex',
  justifyContent: 'space-between',
  color: vars.color.text.caption,
  fontSize: 12,
});

export const searchRoot = style({
  width: '100%',
  minHeight: 0,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  overflow: 'hidden',
});

export const searchForm = style({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: vars.size.space.sm,
  padding: `${vars.size.space.sm} ${vars.size.space.lg} ${vars.size.space.lg}`,
});

export const searchResults = style({
  width: '100%',
  minHeight: 0,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: vars.size.space.sm,
  padding: `0 ${vars.size.space.lg} ${vars.size.space.lg}`,
  overflow: 'auto',
});

export const searchLoading = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: vars.size.space.lg,
});

export const resultCardSelected = style({
  background: vars.color.primary.container,
  selectors: {
    '&:hover': {
      background: vars.color.primary.containerHigh,
    },
  },
});

export const resultContent = style({
  width: '100%',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  overflow: 'hidden',
});

export const resultMeta = style({
  color: vars.color.text.caption,
  fontSize: 12,
});

export const resultArtist = style({
  fontSize: 14,
});

export const resultIconSmall = style({
  width: 16,
  height: 16,
  flexShrink: 0,
  alignSelf: 'center',
  color: vars.color.text.main,
});

export const resultIconMedium = style({
  width: 24,
  height: 24,
  flexShrink: 0,
  alignSelf: 'center',
  color: vars.color.success.main,
});
