import { Trans } from '@jellybrick/solid-i18next';
import { Box, Button } from '@suis-ui/kit';
import { Power, Search, Settings } from 'lucide-solid';
import { type JSX, Show } from 'solid-js';

import { SearchPanel } from '../../components/search-panel';
import { DebugButton } from '../../components/debug-button';
import useConfig from '../../../hooks/useConfig';

import MainIcon from '../../../../assets/icon_music.png';

type HeaderProps = {
  children?: JSX.Element;
};
const Header = (props: HeaderProps) => {
  return (
    <Box
      align="center"
      direction="row"
      gap="sm"
      justify="flex-start"
      p="md"
      w="100%"
      z={20}
    >
      <Box align="center" direction="row" flex={1} gap="xs" text="title">
        <Box
          alt="Main Icon"
          as="img"
          h="1.6rem"
          src={MainIcon}
          style={{ 'object-fit': 'contain' }}
          w="1.6rem"
        />
        Lyrs
      </Box>
      {props.children}
    </Box>
  );
};

export const MainPage = () => {
  const [config] = useConfig();

  const onSetting = () => {
    window.ipcRenderer.invoke('open-window', 'settings');
  };
  const onSearch = () => {
    window.ipcRenderer.invoke('open-window', 'lyrics');
  };
  const onQuit = () => {
    window.ipcRenderer.invoke('quit-application');
  };

  return (
    <Box
      align="stretch"
      direction="column"
      h="100%"
      justify="flex-start"
      w="100%"
    >
      <Header>
        <Button onClick={onQuit} size="sm" type="icon" variant="ghost">
          <Power size={16} />
        </Button>
      </Header>
      <SearchPanel />
      <Box bg="surface.higher" h="1px" mx="lg" />
      <Box direction="row" gap="sm" p="md">
        <Button flex={'auto'} onClick={onSetting} variant="ghost">
          <Box align="center" direction="row" gap="xs" justify="center">
            <Settings size="1.6rem" />
            <Trans key="tray.setting.label" />
          </Box>
        </Button>
        <Button
          flex={'auto'}
          overflow="hidden"
          onClick={onSearch}
          variant="ghost"
        >
          <Box align="center" direction="row" gap="xs" justify="center">
            <Search size="1.6rem" />
            <Trans key="tray.lyrics.label" />
          </Box>
        </Button>
        <Show when={config()?.developer}>
          <DebugButton />
        </Show>
      </Box>
    </Box>
  );
};
