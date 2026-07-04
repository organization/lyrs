import { TransProvider } from '@jellybrick/solid-i18next';

import { MainPage } from './pages/main';

import { LangResource } from '../../common/intl';
import PlayingInfoProvider from '../components/PlayingInfoProvider';
import UserCSS from '../components/UserCSS';
import useConfig from '../hooks/useConfig';

const [config] = useConfig();

const App = () => (
  <TransProvider options={{ resources: LangResource, lng: config()?.language }}>
    <PlayingInfoProvider>
      <MainPage />
      <UserCSS />
    </PlayingInfoProvider>
  </TransProvider>
);

export default App;
