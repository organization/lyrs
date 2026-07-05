import { useTransContext } from '@jellybrick/solid-i18next';
import {
  HashRouter,
  Navigate,
  Route,
  type RouteSectionProps,
  useLocation,
  useNavigate,
} from '@solidjs/router';
import { Box } from '@suis-ui/kit';
import {
  Gamepad2,
  Info,
  LayoutGrid,
  Palette,
  Puzzle,
  Settings,
} from 'lucide-solid';
import { For, type JSX, type Setter } from 'solid-js';
import { Transition } from 'solid-transition-group';

import { ListView, type ListItemData } from './components/list-view';
import {
  AboutPage,
  GameListPage,
  GameOverlayPage,
  GeneralPage,
  PluginPage,
  PluginSettingsPage,
  ThemeListPage,
  ThemePage,
  ViewPage,
} from './pages';

import Layout from '../components/layout';
import usePluginsCSS from '../hooks/usePluginsCSS';

export interface TabItemData extends Omit<ListItemData, 'label'> {
  container: () => JSX.Element;
}

const TAB_LIST = (() => {
  const result: TabItemData[] = [];

  result.push(
    {
      id: 'general',
      icon: <Settings size={18} />,
      container: GeneralPage,
    },
    {
      id: 'view',
      icon: <LayoutGrid size={18} />,
      container: ViewPage,
    },
    {
      id: 'theme',
      icon: <Palette size={18} />,
      container: ThemeListPage,
    },
    {
      id: 'plugin',
      icon: <Puzzle size={18} />,
      container: PluginPage,
    },
  );

  if (window.isWindows) {
    result.push({
      id: 'game-overlay',
      icon: <Gamepad2 size={18} />,
      container: GameOverlayPage,
    });
  }

  result.push({
    id: 'about',
    icon: <Info size={18} />,
    container: AboutPage,
  });

  return result;
})();

const BaseApp = (props: RouteSectionProps) => {
  usePluginsCSS();

  const [t] = useTransContext();
  const navigate = useNavigate();
  const location = useLocation();

  /* properties */
  const tabId = () => location.pathname.match(/(?<=\/)[^/]+/)?.[0] ?? '';
  const listItem = () =>
    TAB_LIST.map((item) => ({
      ...item,
      label: t(`setting.title.${item.id}`),
    }));

  /* methods */
  const setTabId = ((id: string) => {
    navigate(`/${id}`);
  }) as Setter<string>;

  return (
    <Layout>
      <Box
        align="stretch"
        direction="row"
        h="100%"
        justify="flex-start"
        overflow="hidden"
        w="100%"
      >
        <ListView
          items={listItem()}
          onSelectItem={(tab) => setTabId(tab.id)}
          value={[tabId, setTabId]}
        />
        <Transition mode={'outin'} name={'tab'}>
          {props.children}
        </Transition>
      </Box>
    </Layout>
  );
};

const App = () => (
  <HashRouter root={BaseApp}>
    <For each={TAB_LIST}>
      {(tab) => <Route component={tab.container} path={tab.id} />}
    </For>
    <Route component={GameListPage} path={'/game-overlay/list'} />
    <Route component={PluginSettingsPage} path={'/plugin/:id'} />
    <Route component={ThemePage} path={'/theme/:name'} />
    <Route
      component={() => <Navigate href={`/${TAB_LIST[0].id}`} />}
      path={'*'}
    />
  </HashRouter>
);

export default App;
