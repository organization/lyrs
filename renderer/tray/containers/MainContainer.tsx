import { Trans } from '@jellybrick/solid-i18next';
import { useNavigate } from '@solidjs/router';
import { Box, Button } from '@suis-ui/kit';
import { Bug, Power, Search, Settings, SlidersHorizontal } from 'lucide-solid';
import { createSignal, type JSX, Show } from 'solid-js';
import { Transition } from 'solid-transition-group';

import { MenuContainer } from './MenuContainer';
import { SearchContainer } from './SearchContainer';

import MainIcon from '../../../assets/icon_music.png';
import useConfig from '../../hooks/useConfig';

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

export const MainContainer = () => {
  const navigate = useNavigate();
  const [config] = useConfig();
  const [isMenuVisible, setIsMenuVisible] = createSignal(false);

  const onSetting = () => {
    window.ipcRenderer.invoke('open-window', 'settings');
  };
  const onSearch = () => {
    window.ipcRenderer.invoke('open-window', 'lyrics');
  };
  const onQuit = () => {
    window.ipcRenderer.invoke('quit-application');
  };
  const onDebug = () => {
    navigate('/debug');
  };
  const onToggleMenu = () => {
    setIsMenuVisible((prevIsVisible) => !prevIsVisible);
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
        <Show when={config()?.developer}>
          <Button onClick={onDebug} size="sm" type="icon" variant="ghost">
            <Bug size="1.6rem" />
          </Button>
        </Show>
        <Button onClick={onToggleMenu} size="sm" type="icon" variant="ghost">
          <SlidersHorizontal size={16} />
        </Button>
        <Button onClick={onQuit} size="sm" type="icon" variant="ghost">
          <Power size={16} />
        </Button>
      </Header>
      <Transition name="tray-menu">
        <Show when={isMenuVisible()}>
          <MenuContainer onClose={onToggleMenu} />
        </Show>
      </Transition>
      <SearchContainer />
      <Box bg="surface.higher" h="1px" mx="lg" />
      <Box direction="row" gap="sm" p="md">
        <Button flex onClick={onSetting} variant="ghost">
          <Box align="center" direction="row" gap="xs" justify="center">
            <Settings size="1.6rem" />
            <Trans key="tray.setting.label" />
          </Box>
        </Button>
        <Button flex onClick={onSearch} variant="ghost">
          <Box align="center" direction="row" gap="xs" justify="center">
            <Search size="1.6rem" />
            <Trans key="tray.lyrics.label" />
          </Box>
        </Button>
      </Box>
    </Box>
  );
};
