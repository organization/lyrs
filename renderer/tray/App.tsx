import { HashRouter, Route } from '@solidjs/router';
import { createSignal } from 'solid-js';
import { Transition } from 'solid-transition-group';

import { DebugContainer, MainContainer } from './containers';

import PlayingInfoProvider from '../components/PlayingInfoProvider';

export const App = () => {
  const [url, setUrl] = createSignal('/');

  return (
    <div
      class={`
        w-full h-full overflow-hidden
        text-black dark:text-white bg-slate-100/80 dark:bg-gray-800/80
      `}
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
    </div>
  );
};
