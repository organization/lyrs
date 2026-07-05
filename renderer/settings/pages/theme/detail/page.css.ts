import { vars } from '@suis-ui/kit/css';
import { style } from '@vanilla-extract/css';

export const stickyPreview = style({
  position: 'sticky',
  top: `calc(${vars.size.space.lg} * -1)`,
  zIndex: vars.zIndex.sticky,
  marginRight: vars.size.space.lg,
  marginLeft: vars.size.space.lg,
  borderRadius: vars.size.round.md,
  transition: vars.motion.transition.fast,
});

export const stickyPreviewRaised = style({
  background: vars.color.surface.high,
  boxShadow: vars.shadow.xl,
});
