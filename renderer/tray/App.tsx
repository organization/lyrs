import { HashRouter, Route } from '@solidjs/router';
import { Box } from '@suis-ui/kit';
import { createSignal } from 'solid-js';
import { Transition } from 'solid-transition-group';

import { DebugContainer, MainContainer } from './containers';
import * as trayStyles from './tray.css';

import PlayingInfoProvider from '../components/PlayingInfoProvider';

export const App = () => {
  const [url, setUrl] = createSignal('/');

  return (
    <Box
      bg={'surface.main'}
      h={'100%'}
      w={'100%'}
    >
      <PlayingInfoProvider>
        <Transition
          mode={'outin'}
          name={`page-${url() === '/' ? 'left' : 'right'}`}
        >
          <HashRouter
            transformUrl={(url) => {
              setUrl(url);
              return url;
            }}
          >
            <Route component={MainContainer} path={'/'} />
            <Route component={DebugContainer} path={'/debug'} />
          </HashRouter>
        </Transition>
      </PlayingInfoProvider>
    </Box>
  );
};
