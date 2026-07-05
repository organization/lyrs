import { HashRouter, Route } from '@solidjs/router';
import { Box, token } from '@suis-ui/kit';
import { createSignal } from 'solid-js';
import { Transition } from 'solid-transition-group';

import { MainPage } from './pages';

import { alpha } from '../../utils/style';
import PlayingInfoProvider from '../components/playing-info-provider';

export const App = () => {
  const [url, setUrl] = createSignal('/');

  return (
    <Box
      h={'100%'}
      style={{
        background: alpha(token.color.gray[950], 0.5),
      }}
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
            <Route component={MainPage} path={'/'} />
          </HashRouter>
        </Transition>
      </PlayingInfoProvider>
    </Box>
  );
};
