import { vars } from '@suis-ui/kit/css';
import { style } from '@vanilla-extract/css';

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

export const pluginLogPlugin = style([
  pluginLogToken,
  {
    color: vars.color.primary.main,
  },
]);

export const pluginLogTime = style([
  pluginLogToken,
  {
    color: vars.color.primary.main,
  },
]);

export const pluginLogError = style([
  pluginLogToken,
  {
    color: vars.color.error.main,
  },
]);

export const pluginLogWarn = style([
  pluginLogToken,
  {
    color: '#d97706',
  },
]);

export const pluginLogInfo = style([
  pluginLogToken,
  {
    color: '#2563eb',
  },
]);

export const pluginLogDebug = style([
  pluginLogToken,
  {
    color: vars.color.text.caption,
  },
]);
