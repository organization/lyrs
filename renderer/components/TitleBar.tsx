import { ArrowLeft, Copy, Minus, Square, X } from 'lucide-solid';
import { createSignal, Match, Show, Switch } from 'solid-js';

import * as styles from './components.css';

import { cx } from '../utils/classNames';

import type { JSX } from 'solid-js/jsx-runtime';

const isMac = /Mac/.test(navigator.userAgent);

type ButtonProps = {
  onClick?: () => void;
  children: JSX.Element;
};

const Button = (props: ButtonProps) => {
  return (
    <button
      class={styles.titleButton}
      onClick={() => props?.onClick?.()}
      style={{
        '-webkit-app-region': 'no-drag',
      }}
    >
      {props.children}
    </button>
  );
};

const TitleBar = () => {
  const [isMaximized, setMaximized] = createSignal(false);

  return (
    <div
      class={styles.titleBar}
      style={{
        '-webkit-user-select': 'none',
        '-webkit-app-region': 'drag',
      }}
    >
      <button
        class={cx(
          styles.titleBackButton,
          isMac && styles.titleBackButtonMac,
        )}
        onClick={() => history.back()}
        style={{
          '-webkit-app-region': 'no-drag',
        }}
      >
        <ArrowLeft class={cx(isMac ? styles.iconSmall : styles.iconMedium)} />
      </button>
      <div class={styles.titleBarSpacer} />
      <Show when={!isMac}>
        <Button
          onClick={() => {
            window.ipcRenderer.invoke('window-minimize');
          }}
        >
          <Minus class={styles.iconMedium} />
        </Button>
        <Button
          onClick={() => {
            window.ipcRenderer.invoke('window-maximize').then(async () => {
              setMaximized(
                await window.ipcRenderer.invoke('window-is-maximized'),
              );
            });
          }}
        >
          <Switch
            fallback={
              <Copy class={styles.iconMedium} />
            }
          >
            <Match when={!isMaximized()}>
              <Square class={styles.iconMedium} />
            </Match>
          </Switch>
        </Button>
        <Button
          onClick={() => {
            window.ipcRenderer.invoke('window-close');
          }}
        >
          <X class={styles.iconMedium} />
        </Button>
      </Show>
    </div>
  );
};

export default TitleBar;
