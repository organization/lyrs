import { HashRouter, Route } from '@solidjs/router';
import { Box, token } from '@suis-ui/kit';
import { createSignal } from 'solid-js';
import { Transition } from 'solid-transition-group';

import { MainPage } from './pages';

import PlayingInfoProvider from '../components/PlayingInfoProvider';
import { alpha } from '../../utils/style';

export const App = () => {
  const [url, setUrl] = createSignal('/');

  return (
    <Box
      w={'100%'}
      h={'100%'}
      style={{
        background: alpha(token.color.gray[950], 0.5),
      }}
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
