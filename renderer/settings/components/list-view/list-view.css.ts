import { vars } from '@suis-ui/kit/css';
import { style } from '@vanilla-extract/css';

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
