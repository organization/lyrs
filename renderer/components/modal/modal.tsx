import { Box, Button, token } from '@suis-ui/kit';
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

import { alpha } from '../../../utils/style';
import { dangerButton } from '../button';
import { ScrollArea } from '../scroll-area';

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
          <Box
            align="center"
            bottom="0"
            direction="row"
            h="100%"
            justify="center"
            left="0"
            pos="fixed"
            right="0"
            style={{ background: alpha(token.color.gray[900], 0.4) }}
            top="0"
            w="100%"
          >
            <Box
              {...leftProps}
              bc="surface.higher"
              bd="thin"
              bg="surface.main"
              c="text.main"
              direction="column"
              h="fit-content"
              maxH="80vh"
              overflow="hidden"
              r="sm"
              ref={(element) => {
                content = element;
              }}
              shadow="xl"
              w="fit-content"
            >
              <ScrollArea
                align="stretch"
                direction="column"
                fadeAxes="y"
                overflow="auto"
                px="xxl"
                py="xl"
              >
                {props.children}
              </ScrollArea>
              <Show when={local.buttons}>
                <Box
                  align="center"
                  bg="surface.high"
                  direction="row"
                  gap="sm"
                  justify="flex-end"
                  px="xxl"
                  py="xl"
                >
                  <For each={local.buttons ?? []}>
                    {(button) => (
                      <Button
                        class={
                          button.type === 'negative' ? dangerButton : undefined
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
                </Box>
              </Show>
            </Box>
          </Box>
        </Show>
      </Transition>
    </Portal>
  );
};

export default Modal;
