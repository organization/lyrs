import { useTransContext } from '@jellybrick/solid-i18next';
import {
  Box,
  type BoxProps,
  Button,
  createClickAway,
  Item,
  Popup,
  token,
  vars,
} from '@suis-ui/kit';
import { AppWindowMac, ChevronRight, Search, Settings } from 'lucide-solid';
import Bug from 'lucide-solid/icons/bug';
import { createSignal, For, onCleanup } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import useConfig from '../../../hooks/useConfig';

type DebugMenuProps = BoxProps<'div'>;
const DebugMenu = (props: DebugMenuProps) => {
  const [config] = useConfig();
  const [t] = useTransContext();

  const onDebug = (target: 'lyrics' | 'settings' | 'tray') => {
    window.ipcRenderer.invoke('open-devtool', target);
  };
  const onMainDebug = (index: number) => {
    window.ipcRenderer.invoke('open-devtool', 'main', index);
  };

  const targetWindows = () =>
    [
      {
        icon: Search,
        target: 'lyrics',
        title: t('tray.devtools.lyrics.label'),
      },
      {
        icon: Settings,
        target: 'settings',
        title: t('tray.devtools.setting.label'),
      },
      {
        icon: AppWindowMac,
        target: 'tray',
        title: t('tray.devtools.tray.label'),
      },
    ] as const;

  return (
    <Box
      {...props}
      bc={'surface.higher'}
      bd={'md'}
      bg={'surface.main'}
      my={'md'}
      r={'lg'}
      shadow={'lg'}
      w={`calc(${token.size['9']} * 4 - ${token.size['-2']} - ${vars.size.space.md} * 2)`}
    >
      <Box c={'text.caption'} pt={'sm'} px={'md'} text={'caption'}>
        렌더러
      </Box>
      <Box p={'xs'}>
        <For each={config()?.views}>
          {(_, index) => (
            <Item
              action={
                <ChevronRight
                  height={token.size['1']}
                  width={token.size['1']}
                />
              }
              as={Button}
              onClick={() => onMainDebug(index())}
              title={t('tray.devtools.lyric-viewer.label', {
                index: index(),
              })}
              variant="ghost"
              w="100%"
            />
          )}
        </For>
      </Box>
      <Box bg={'surface.higher'} h={vars.size.line.md} />
      <Box c={'text.caption'} pt={'sm'} px={'md'} text={'caption'}>
        기본
      </Box>
      <Box p={'xs'}>
        <For each={targetWindows()}>
          {(item) => (
            <Item
              action={
                <ChevronRight
                  height={token.size['1']}
                  width={token.size['1']}
                />
              }
              as={Button}
              media={
                <Dynamic
                  component={item.icon}
                  height={token.size['1']}
                  width={token.size['1']}
                />
              }
              onClick={() => onDebug(item.target)}
              title={item.title}
              variant="ghost"
              w="100%"
            />
          )}
        </For>
      </Box>
    </Box>
  );
};

export const DebugButton = () => {
  const [open, setOpen] = createSignal(false);

  const register = createClickAway(() => {
    setOpen(false);
  });

  return (
    <Popup
      element={<DebugMenu ref={(el) => onCleanup(register(el))} />}
      open={open()}
      placement="top-end"
    >
      <Button
        active={open()}
        onClick={() => setOpen((prev) => !prev)}
        r={'sm'}
        size="sm"
        type="icon"
        variant="ghost"
      >
        <Bug size={token.size['1']} />
      </Button>
    </Popup>
  );
};
