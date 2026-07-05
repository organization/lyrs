import { token, vars } from '@suis-ui/kit/css';
import { style } from '@vanilla-extract/css';

export const navScrollArea = style({
  position: 'relative',
  width: `calc(${token.size['9']} * 4 + ${token.size['4']} + ${token.size['3']})`,
  height: '100%',
  flexShrink: 0,
});

export const navList = style({
  position: 'relative',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: vars.size.space.xs,
  margin: 0,
  padding: vars.size.space.lg,
  listStyle: 'none',
});

export const navIndicator = style({
  position: 'absolute',
  left: vars.size.space.lg,
  top: `calc(${vars.size.space.md} - ${vars.size.line.thick})`,
  width: `calc(${vars.size.line.thick} + ${vars.size.line.md})`,
  height: token.size['1'],
  background: vars.color.primary.main,
  borderRadius: vars.size.round.full,
  transition: vars.motion.transition.normal,
});

export const navIndicatorHidden = style({
  opacity: 0,
  scale: 0,
});

export const navItem = style({
  position: 'relative',
  width: '100%',
  minHeight: token.size['5'],
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
  fontSize: `calc(${vars.font.body.fontSize} + ${vars.size.line.md})`,
});
