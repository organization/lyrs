import '@suis-ui/kit/style.css';

import './assets/fonts/pretendardvariable-jp.css';
import './predefined.css';
import './styles/base.css';
import './styles/transitions.css';

import { TransProvider } from '@jellybrick/solid-i18next';
import { createTheme, ThemeProvider, token, useTheme, vars } from '@suis-ui/kit';
import {
  createRenderEffect,
  createSignal,
  onCleanup,
  type JSX,
} from 'solid-js';

import useConfig from './hooks/useConfig';

import { LangResource } from '../common/intl';
import { alpha } from '../utils/style';

export interface ProviderProps {
  children: JSX.Element;
}

// const lightTheme = createTheme({

// });

const darkTheme = createTheme({
  component: {
    button: {
      size: {
        small: {
          radius: vars.size.round.sm,
        },
      },
    },
  },
  vars: {
    color: {
      surface: {
        main: alpha(token.color.gray[900], 1),
        high: alpha(token.color.gray[800], 1),
        higher: alpha(token.color.gray[700], 1),
        contrast: token.color.gray[100],
      },
      text: {
        main: token.color.gray[100],
        caption: token.color.gray[400],
        disabled: token.color.gray[500],
      },
      error: {
        main: token.color.red[500],
        contrast: token.color.gray[100],
        high: token.color.red[400],
        higher: token.color.red[300],
        container: token.color.red[100],
        containerHigh: token.color.red[200],
        containerHigher: token.color.red[300],
        containerContrast: token.color.gray[100],
      },
    },
    font: {
      title: {
        fontSize: token.textSize[0],
        fontWeight: 'bold',
      },
    },
  },
});

const ThemeSync = (props: ProviderProps) => {
  const [config] = useConfig();
  const [, setTheme] = useTheme();
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const [systemDark, setSystemDark] = createSignal(media.matches);

  const onSystemThemeChange = (event: MediaQueryListEvent) => {
    setSystemDark(event.matches);
  };

  media.addEventListener('change', onSystemThemeChange);
  onCleanup(() => {
    media.removeEventListener('change', onSystemThemeChange);
  });

  createRenderEffect(() => {
    const theme = config()?.appTheme;
    const isDark = theme === 'dark' || (theme === 'system' && systemDark());

    document.body.dataset.colorScheme = isDark ? 'dark' : 'light';
    setTheme(isDark ? darkTheme : null);
  });

  return (
    <TransProvider
      options={{
        resources: LangResource,
        lng: config()?.language,
      }}
    >
      {props.children}
    </TransProvider>
  );
};

const Provider = (props: ProviderProps) => (
  <ThemeProvider>
    <ThemeSync>{props.children}</ThemeSync>
  </ThemeProvider>
);

export default Provider;
