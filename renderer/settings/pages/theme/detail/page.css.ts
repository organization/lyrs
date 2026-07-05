import { vars } from '@suis-ui/kit/css';
import { style } from '@vanilla-extract/css';

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
