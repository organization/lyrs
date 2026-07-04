import {
  Box,
  BoxProps,
  Button,
  createClickAway,
  Item,
  Popup,
  vars,
} from '@suis-ui/kit';
import Bug from 'lucide-solid/icons/bug';
import useConfig from '../../../hooks/useConfig';
import { useTransContext } from '@jellybrick/solid-i18next';
import { createSignal, For, onCleanup } from 'solid-js';
import { AppWindowMac, ChevronRight, Search, Settings } from 'lucide-solid';
import { Dynamic } from 'solid-js/web';

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
      w={`calc(25rem - ${vars.size.space.md} * 2)`}
      my={'md'}
      bg={'surface.main'}
      bd={'md'}
      bc={'surface.higher'}
      r={'lg'}
      shadow={'lg'}
    >
      <Box text={'caption'} c={'text.caption'} px={'md'} pt={'sm'}>
        렌더러
      </Box>
      <Box p={'xs'}>
        <For each={config()?.views}>
          {(_, index) => (
            <Item
              as={Button}
              onClick={() => onMainDebug(index())}
              title={t('tray.devtools.lyric-viewer.label', {
                index: index(),
              })}
              variant="ghost"
              w="100%"
              action={<ChevronRight width={'1.6rem'} height={'1.6rem'} />}
            />
          )}
        </For>
      </Box>
      <Box bg={'surface.higher'} h={'1px'} />
      <Box text={'caption'} c={'text.caption'} px={'md'} pt={'sm'}>
        기본
      </Box>
      <Box p={'xs'}>
        <For each={targetWindows()}>
          {(item) => (
            <Item
              as={Button}
              onClick={() => onDebug(item.target)}
              variant="ghost"
              w="100%"
              title={item.title}
              media={
                <Dynamic
                  component={item.icon}
                  width={'1.6rem'}
                  height={'1.6rem'}
                />
              }
              action={<ChevronRight width={'1.6rem'} height={'1.6rem'} />}
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
      open={open()}
      element={<DebugMenu ref={(el) => onCleanup(register(el))} />}
      placement="top-end"
    >
      <Button
        size="sm"
        type="icon"
        r={'sm'}
        variant="ghost"
        active={open()}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Bug size="1.6rem" />
      </Button>
    </Popup>
  );
};
