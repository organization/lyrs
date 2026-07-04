import { vars } from '@suis-ui/kit/css';
import { style } from '@vanilla-extract/css';

export const root = style({
  width: '100%',
  height: '100%',
  minHeight: 0,
  display: 'flex',
  alignItems: 'stretch',
  color: vars.color.text.main,
});

export const content = style({
  minWidth: 0,
  minHeight: 0,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.size.space.xs,
  paddingTop: vars.size.space.lg,
  overflow: 'hidden',
});

export const searchForm = style({
  width: '100%',
  display: 'flex',
  gap: vars.size.space.sm,
  padding: `0 ${vars.size.space.lg}`,
  marginBottom: vars.size.space.lg,
  flexShrink: 0,
});

export const results = style({
  width: '100%',
  minHeight: 0,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: vars.size.space.xs,
  padding: `0 ${vars.size.space.lg} ${vars.size.space.lg}`,
  overflowY: 'auto',
});

export const empty = style({
  color: vars.color.text.caption,
});

export const selectedCard = style({
  background: vars.color.primary.container,
  selectors: {
    '&:hover': {
      background: vars.color.primary.containerHigh,
    },
  },
});

export const resultContent = style({
  minWidth: 0,
  flex: 1,
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

export const resultSideMeta = style({
  width: 140,
  flexShrink: 0,
  alignSelf: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
  marginRight: vars.size.space.md,
});

export const resultDate = style({
  color: vars.color.text.caption,
  fontSize: 14,
  textAlign: 'right',
});

export const resultIcon = style({
  width: 24,
  height: 24,
  flexShrink: 0,
  alignSelf: 'center',
  color: vars.color.text.main,
});

export const resultCheckIcon = style([
  resultIcon,
  {
    color: vars.color.success.main,
  },
]);

export const sidebarRoot = style({
  width: 312,
  height: '100%',
  minHeight: 0,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: vars.size.space.sm,
  padding: vars.size.space.lg,
  overflow: 'hidden',
});

export const sidebarTitle = style({
  fontSize: 20,
  lineHeight: 1.3,
});

export const sidebarTitleSpaced = style([
  sidebarTitle,
  {
    marginTop: vars.size.space.lg,
  },
]);

export const progress = style({
  width: '280px !important',
});

export const sidebarRow = style({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.size.space.md,
});

export const sidebarDelayEditor = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: vars.size.space.md,
});

export const currentLyricSummary = style({
  minWidth: 0,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
});

export const marquee = style({
  width: '100%',
});

export const lyricList = style({
  minHeight: 0,
  flex: 1,
  overflowY: 'auto',
  overflowX: 'visible',
  textAlign: 'center',
  willChange: 'scroll-position',
});

export const lyricLine = style({
  margin: `${vars.size.space.lg} 0`,
  whiteSpace: 'pre-line',
});

export const lyricLineActive = style({
  color: vars.color.primary.main,
});
