import { token, vars } from '@suis-ui/kit/css';
import { globalStyle } from '@vanilla-extract/css';

const enter = `all 0.225s ${vars.motion.easing.emphasized}`;
const exit = 'all 0.225s cubic-bezier(0.5, 0, 0.75, 0)';

globalStyle(
  '.tab-enter-active, .page-right-enter-active, .page-left-enter-active, .card-enter-active',
  {
    transition: enter,
  },
);

globalStyle(
  '.tab-exit-active, .page-right-exit-active, .page-left-exit-active, .card-exit-active',
  {
    transition: exit,
  },
);

globalStyle('.tab-enter', {
  opacity: 0,
  transform: `translateY(calc(${token.size['9']} * 2))`,
});

globalStyle('.tab-exit-to, .card-exit-to', {
  opacity: 0,
});

globalStyle('.page-right-enter', {
  opacity: 0,
  transform: 'translateX(100%)',
});

globalStyle('.page-right-exit-to', {
  opacity: 0,
  transform: 'translateX(-100%)',
});

globalStyle('.page-left-enter', {
  opacity: 0,
  transform: 'translateX(-100%)',
});

globalStyle('.page-left-exit-to', {
  opacity: 0,
  transform: 'translateX(100%)',
});

globalStyle('.card-enter', {
  opacity: 0,
  transform: `translateY(calc(-1 * ${vars.size.space.xxl}))`,
});

globalStyle('.selector-enter-active', {
  transformOrigin: '0% var(--percent, 0%)',
  transition: `all ${vars.motion.duration.slower} ${vars.motion.easing.emphasized}`,
});

globalStyle(
  '.selector-exit-active, .modal-exit-active, .tray-menu-exit-active',
  {
    transition: `all ${vars.motion.duration.normal} ${vars.motion.easing.emphasized}`,
  },
);

globalStyle('.selector-enter', {
  opacity: 0,
  transform: 'scaleY(0.1)',
  transformOrigin: '0% var(--percent, 0%)',
});

globalStyle('.selector-exit-to, .tray-menu-enter, .tray-menu-exit-to', {
  opacity: 0,
});

globalStyle('.modal-enter-active, .tray-menu-enter-active', {
  transition: `all ${vars.motion.duration.slower} ${vars.motion.easing.emphasized}`,
});

globalStyle('.modal-enter', {
  opacity: 0,
  transform: 'scale(1.1)',
});

globalStyle('.modal-exit-to', {
  opacity: 0,
  transform: 'scale(0.9)',
});
