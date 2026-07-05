import { Trans, useTransContext } from '@jellybrick/solid-i18next';
import { useNavigate } from '@solidjs/router';
import { Button } from '@suis-ui/kit';
import { ChevronDown, ChevronRight, LoaderCircle } from 'lucide-solid';
import {
  createResource,
  createSignal,
  For,
  Match,
  Show,
  Switch,
} from 'solid-js';

import GameCard from './components/game-card';
import GameViewModal from './components/game-view-modal';
import * as styles from './page.css';

import Card from '../../../components/Card';
import useConfig from '../../../hooks/useConfig';
import useGameList from '../../../hooks/useGameList';
import usePlayingGame from '../../../hooks/usePlayingGame';
import { cx } from '../../../utils/classNames';
import {
  CardCaption,
  CardRow,
  CardSummary,
  CardSummaryLine,
  iconSmallProps,
  PageRoot,
  PageTitle,
  SectionTitle,
} from '../../components/setting-layout';

interface ProcessData {
  name: string;
  pid: number;
  path: string;
  title?: string;
  icon?: string;
}

export const GameOverlayPage = () => {
  const [processViewMode, setProcessViewMode] = createSignal<
    'all' | 'available'
  >('available');
  const [target, setTarget] = createSignal<ProcessData | null>(null);

  const navigate = useNavigate();
  const [gameList, setGameList] = useGameList();
  const playingGame = usePlayingGame();
  const [t] = useTransContext();
  const [config] = useConfig();

  const gameCount = () => Object.values(gameList()).flat().length;

  const [processList, { refetch }] = createResource(
    processViewMode,
    async (viewMode) => {
      const availableWindows = window.hmc.getAllWindowsHandle(true);
      const availableWindowsPID = availableWindows.map((it) =>
        window.hmc.getHandleProcessID(it),
      );

      const root = window.systemRoot.toLowerCase();
      const isAll = viewMode === 'all';
      const processList = window.hmc
        .getDetailsProcessList()
        .filter(({ pid }) => isAll || availableWindowsPID.includes(pid));

      const result: (ProcessData | null)[] = await Promise.all(
        processList.map(async (data) => {
          if (data.path.toLowerCase().startsWith(root)) return null;

          const icon = await window.ipcRenderer.invoke('get-icon', data.path);

          return {
            ...data,
            icon: icon ?? undefined,
          } satisfies ProcessData;
        }),
      );

      return result.filter(Boolean);
    },
  );

  const onAddGame = async (viewName: string) => {
    const data = target();
    if (!data) return;

    const list = { ...gameList() };
    if (!list[viewName]) {
      list[viewName] = [
        {
          name: data.name,
          path: data.path,
        },
      ];
    } else {
      list[viewName].push({
        name: data.name,
        path: data.path,
      });
    }

    await setGameList(list, false);
    setTarget(null);
    window.ipcRenderer.invoke(
      'inject-overlay-to-process',
      data.pid,
      data.name,
      data.path,
    );
  };
  const onRemoveGame = (path: string) => {
    const list = { ...gameList() };

    const key = Object.keys(list).find((key) =>
      list[key].some((it) => it.path === path),
    );
    if (!key) return;

    const index = list[key].findIndex((it) => it.path === path);
    if (index < 0) return;

    list[key].splice(index, 1);
    setGameList(list, false);
  };
  const onGameListPage = () => {
    navigate('/game-overlay/list');
  };

  return (
    <PageRoot>
      <PageTitle>
        <Trans key={'setting.title.game-overlay'} />
      </PageTitle>
      <SectionTitle>
        <Trans key={'setting.game.current-playing-game'} />
      </SectionTitle>
      <For
        each={playingGame()}
        fallback={
          <Card>
            <Trans key={'setting.game.not-detected'} />
          </Card>
        }
      >
        {(game) => {
          const icon = () =>
            processList()?.find((it) => it?.pid === game.pid)?.icon;

          return <GameCard icon={icon()} name={game.name} path={game.path} />;
        }}
      </For>
      <SectionTitle>
        <Trans key={'setting.game.list-of-registered-games'} />
      </SectionTitle>
      <Card onClick={onGameListPage}>
        <CardSummary>
          <CardSummaryLine>
            <Trans key={'setting.game.registered-games'} />
          </CardSummaryLine>
          <CardCaption>
            <Trans
              key={'setting.game.registered-games-count'}
              options={{ count: gameCount() }}
            />
          </CardCaption>
        </CardSummary>
        <ChevronRight {...iconSmallProps} />
      </Card>

      <CardRow>
        <SectionTitle>
          <Trans key={'setting.game.search-game'} />
        </SectionTitle>
        <Button onClick={() => refetch()} type="icon" variant="ghost">
          <LoaderCircle
            {...iconSmallProps}
            class={cx(processList.loading && styles.iconSpin)}
          />
        </Button>
      </CardRow>

      <Switch>
        <Match when={processList.state === 'ready'}>
          <For each={processList()}>
            {(process) => (
              <GameCard
                icon={process.icon}
                name={process.name}
                path={process.path}
              >
                <Show
                  fallback={
                    <Button
                      onClick={() => setTarget(process)}
                      variant="primary"
                    >
                      <Trans key={'setting.game.register-game'} />
                    </Button>
                  }
                  when={gameList()[process.path]}
                >
                  <Button
                    onClick={() => onRemoveGame(process.path)}
                    variant="ghost"
                  >
                    <Trans key={'setting.game.unregister-game'} />
                  </Button>
                </Show>
              </GameCard>
            )}
          </For>
          <Button
            onClick={() => {
              setProcessViewMode(
                processViewMode() === 'all' ? 'available' : 'all',
              );
            }}
            variant="ghost"
          >
            <ChevronDown
              {...iconSmallProps}
              class={cx(processViewMode() === 'all' && styles.iconRotated)}
            />
            {processViewMode() === 'available'
              ? t('setting.game.show-all-programs-running-in-the-background')
              : t('setting.game.show-only-programs-running-in-the-foreground')}
          </Button>
        </Match>
        <Match
          when={
            processList.state === 'refreshing' ||
            processList.state === 'pending'
          }
        >
          <Card>{t('setting.game.refreshing-process-list')}</Card>
        </Match>
      </Switch>

      <GameViewModal
        onClose={() => setTarget(null)}
        onSelectView={onAddGame}
        open={!!target()}
        views={config()?.views}
      />
    </PageRoot>
  );
};
