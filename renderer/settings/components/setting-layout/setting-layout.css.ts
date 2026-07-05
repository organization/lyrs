import { token, vars } from '@suis-ui/kit/css';
import { style } from '@vanilla-extract/css';

export const description = style({
  whiteSpace: 'pre-line',
});

export const emptyState = style({
  textAlign: 'center',
});

export const checkPlaceholder = style({
  flexShrink: 0,
});

export const iconImage = style({
  width: token.size['3'],
  height: token.size['3'],
  flexShrink: 0,
  objectFit: 'contain',
});

export const avatarImage = style({
  borderRadius: vars.size.round.full,
});

export const breadcrumbRoot = style({
  userSelect: 'none',
});

export const breadcrumbParent = style({
  cursor: 'pointer',
});

export const codeBlock = style({
  color: vars.color.surface.main,
  background: token.color.gray[700],
  fontFamily: 'monospace',
  whiteSpace: 'pre-wrap',
});
