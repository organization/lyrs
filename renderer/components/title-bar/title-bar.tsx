import { Box, Button, token, vars } from '@suis-ui/kit';
import { ArrowLeft, Copy, Minus, Square, X } from 'lucide-solid';
import { createSignal, Match, Show, Switch } from 'solid-js';

import MainIcon from '../../../assets/icon_music.png';

import type { JSX } from 'solid-js/jsx-runtime';


const isMac = /Mac/.test(navigator.userAgent);
const isWindows = /Win/.test(navigator.userAgent);

type TitleButtonProps = {
  onClick?: () => void;
  children: JSX.Element;
};

const TITLE_BUTTON_HEIGHT = `calc(${vars.size.space.xxl} + ${vars.size.space.sm})`;
const TitleButton = (props: TitleButtonProps) => {
  return (
    <Button
      c={'text.caption'}
      onClick={() => props?.onClick?.()}
      size={'sm'}
      style={{
        '-webkit-app-region': 'no-drag',
      }}
      type={'icon'}
      variant={'ghost'}
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
        align="center"
        direction="row"
        flex
        gap="xs"
        text="title"
      >
        <Box
          alt="Main Icon"
          as="img"
          h={token.size['0']}
          src={MainIcon}
          style={{ 'object-fit': 'contain' }}
          w={token.size['0']}
        />
        Lyrs
      </Box>
    </Box>
  );
};

export const TitleBar = () => {
  const [isMaximized, setMaximized] = createSignal(false);

  return (
    <Box
      align="center"
      direction="row"
      h={TITLE_BUTTON_HEIGHT}
      justify="flex-end"
      p={'xs'}
      style={{
        '-webkit-app-region': 'drag',
        '-webkit-user-select': 'none',
        'margin-top': isWindows ? `calc(-1 * ${vars.size.space.xxs})` : undefined,
      }}
      w="100%"
      z={50}
    >
      <Button
        c={'text.caption'}
        onClick={() => history.back()}
        size={'sm'}
        style={{
          '-webkit-app-region': 'no-drag',
          'margin-left': isMac
            ? `calc(${token.size['9']} + ${token.size['-2']})`
            : undefined,
          'margin-top': isMac ? vars.size.space.xs : undefined,
        }}
        type={'icon'}
        variant={'ghost'}
      >
        <ArrowLeft size={token.size['0']} />
      </Button>
      <Logo />
      <Box flex={1} />
      <Show when={!isMac}>
        <Box
          align={'center'}
          direction={'row'}
          gap={'xs'}
          justify={'flex-end'}
        >
          <TitleButton
            onClick={() => {
              window.ipcRenderer.invoke('window-minimize');
            }}
          >
            <Minus size={token.size['0']} />
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
            <Switch fallback={<Copy size={token.size['0']} />}>
              <Match when={!isMaximized()}>
                <Square size={token.size['0']} />
              </Match>
            </Switch>
          </TitleButton>
          <TitleButton
            onClick={() => {
              window.ipcRenderer.invoke('window-close');
            }}
          >
            <X size={token.size['0']} />
          </TitleButton>
        </Box>
      </Show>
    </Box>
  );
};
