import { Button } from '@suis-ui/kit';
import {
  createEffect,
  For,
  type JSX,
  onCleanup,
  Show,
  splitProps,
} from 'solid-js';
import { Portal } from 'solid-js/web';
import { Transition } from 'solid-transition-group';

import * as styles from './components.css';

export interface ButtonOptions {
  type?: 'positive' | 'negative' | 'normal';
  name?: string;
  onClick?: () => void;
}
export interface ModalProps extends JSX.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onClose?: () => void;

  buttons?: ButtonOptions[];
}

const Modal = (props: ModalProps) => {
  const [local, leftProps] = splitProps(props, [
    'open',
    'onClose',
    'buttons',
    'class',
    'classList',
  ]);

  let content!: HTMLDivElement;

  const listener = (event: MouseEvent) => {
    const isOutside = !event.composedPath().some((it) => it === content);

    if (isOutside) local.onClose?.();
  };

  createEffect(() => {
    if (local.open) {
      document.removeEventListener('click', listener);
      document.addEventListener('click', listener);
    }
  });

  onCleanup(() => {
    document.removeEventListener('click', listener);
  });

  return (
    <Portal mount={document.querySelector('#app')!}>
      <Transition name={'modal'}>
        <Show when={local.open}>
          <div class={styles.modalOverlay}>
            <div
              {...leftProps}
              class={styles.modalContent}
              ref={content}
            >
              <div class={styles.modalBody}>{props.children}</div>
              <Show when={local.buttons}>
                <div class={styles.modalFooter}>
                  <For each={local.buttons ?? []}>
                    {(button) => (
                      <Button
                        class={
                          button.type === 'negative'
                            ? styles.dangerButton
                            : undefined
                        }
                        onClick={button.onClick}
                        variant={
                          button.type === 'positive' ? 'primary' : 'secondary'
                        }
                      >
                        {button.name}
                      </Button>
                    )}
                  </For>
                </div>
              </Show>
            </div>
          </div>
        </Show>
      </Transition>
    </Portal>
  );
};

export default Modal;
