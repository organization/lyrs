import { Box, Button } from '@suis-ui/kit';
import { ArrowLeft, Copy, Minus, Square, X } from 'lucide-solid';
import { createSignal, Match, Show, Switch } from 'solid-js';

import type { JSX } from 'solid-js/jsx-runtime';
import MainIcon from '../../../assets/icon_music.png';


const isMac = /Mac/.test(navigator.userAgent);
const isWindows = /Win/.test(navigator.userAgent);

type TitleButtonProps = {
  onClick?: () => void;
  children: JSX.Element;
};

const TITLE_BUTTON_HEIGHT = '40px';
const TitleButton = (props: TitleButtonProps) => {
  return (
    <Button
      variant={'ghost'}
      type={"icon"}
      c={"text.caption"}
      size={'sm'}
      onClick={() => props?.onClick?.()}
      style={{
        '-webkit-app-region': 'no-drag',
      }}
    >
      {props.children}
    </Button>
  );
};

const Logo = () => {
  return (
    <Box
      align="center"
      direction="row"
      gap="sm"
      justify="flex-start"
      w="100%"
    >
      <Box
        flex
        direction="row"
        align="center"
        gap="xs"
        text="title"
      >
        <Box
          alt="Main Icon"
          as="img"
          h="1.2rem"
          src={MainIcon}
          style={{ 'object-fit': 'contain' }}
          w="1.2rem"
        />
        Lyrs
      </Box>
    </Box>
  )
}

export const TitleBar = () => {
  const [isMaximized, setMaximized] = createSignal(false);

  return (
    <Box
      w="100%"
      h={TITLE_BUTTON_HEIGHT}
      direction="row"
      align="center"
      justify="flex-end"
      style={{
        '-webkit-app-region': 'drag',
        '-webkit-user-select': 'none',
        'margin-top': isWindows ? '-2px' : undefined,
      }}
      z={50}
      p={'xs'}
    >
      <Button
        variant={'ghost'}
        type={"icon"}
        c={"text.caption"}
        size={'sm'}
        onClick={() => history.back()}
        style={{
          '-webkit-app-region': 'no-drag',
          'margin-left': isMac ? '70px' : undefined,
          'margin-top': isMac ? '4px' : undefined,
        }}
      >
        <ArrowLeft size={'1.2rem'} />
      </Button>
      <Logo />
      <Box flex={1} />
      <Show when={!isMac}>
        <Box
          direction={'row'}
          justify={'flex-end'}
          align={'center'}
          gap={'xs'}
        >
          <TitleButton
            onClick={() => {
              window.ipcRenderer.invoke('window-minimize');
            }}
          >
            <Minus size={'1.2rem'} />
          </TitleButton>
          <TitleButton
            onClick={() => {
              window.ipcRenderer.invoke('window-maximize').then(async () => {
                setMaximized(
                  await window.ipcRenderer.invoke('window-is-maximized'),
                );
              });
            }}
          >
            <Switch fallback={<Copy size={'1.2rem'} />}>
              <Match when={!isMaximized()}>
                <Square size={'1.2rem'} />
              </Match>
            </Switch>
          </TitleButton>
          <TitleButton
            onClick={() => {
              window.ipcRenderer.invoke('window-close');
            }}
          >
            <X size={'1.2rem'} />
          </TitleButton>
        </Box>
      </Show>
    </Box>
  );
};
