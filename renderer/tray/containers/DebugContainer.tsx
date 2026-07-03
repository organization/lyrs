import { Trans, useTransContext } from '@jellybrick/solid-i18next';
import { Box, Button } from '@suis-ui/kit';
import { For } from 'solid-js';

import useConfig from '../../hooks/useConfig';
import { Header } from '../components';

export const DebugContainer = () => {
  const [config] = useConfig();
  const [t] = useTransContext();

  const onDebug = (target: 'lyrics' | 'settings' | 'tray') => {
    window.ipcRenderer.invoke('open-devtool', target);
  };
  const onMainDebug = (index: number) => {
    window.ipcRenderer.invoke('open-devtool', 'main', index);
  };

  return (
    <Box
      align="stretch"
      direction="column"
      gap="sm"
      h="100%"
      justify="flex-start"
      overflow="yAuto"
      p="lg"
      w="100%"
    >
      <Header title={t('tray.devtools.label')} />
      <For each={config()?.views}>
        {(_, index) => (
          <Button
            onClick={() => onMainDebug(index())}
            variant="ghost"
            w="100%"
          >
            <Trans
              key={'tray.devtools.lyric-viewer.label'}
              options={{ index: index() }}
            />
          </Button>
        )}
      </For>
      <Button onClick={() => onDebug('lyrics')} variant="ghost" w="100%">
        <Trans key={'tray.devtools.lyrics.label'} />
      </Button>
      <Button onClick={() => onDebug('settings')} variant="ghost" w="100%">
        <Trans key={'tray.devtools.setting.label'} />
      </Button>
      <Button onClick={() => onDebug('tray')} variant="ghost" w="100%">
        <Trans key={'tray.devtools.tray.label'} />
      </Button>
    </Box>
  );
};
