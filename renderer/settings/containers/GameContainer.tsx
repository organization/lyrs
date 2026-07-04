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

import Card from '../../components/Card';
import Modal from '../../components/Modal';
import useConfig from '../../hooks/useConfig';
import useGameList from '../../hooks/useGameList';
import usePlayingGame from '../../hooks/usePlayingGame';
import { cx } from '../../utils/classNames';
import GameCard from '../components/GameCard';
import * as settingsStyles from '../settings.css';

interface ProcessData {
  name: string;
  pid: number;
  path: string;
  title?: string;
  icon?: string;
}

const GameContainer = () => {
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
    <div class={settingsStyles.pageRoot}>
      <div class={settingsStyles.pageTitle}>
        <Trans key={'setting.title.game-overlay'} />
      </div>
      <div class={settingsStyles.sectionTitle}>
        <Trans key={'setting.game.current-playing-game'} />
      </div>
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
      <div class={settingsStyles.sectionTitle}>
        <Trans key={'setting.game.list-of-registered-games'} />
      </div>
      <Card onClick={onGameListPage}>
        <div class={settingsStyles.pluginSummary}>
          <div class={settingsStyles.pluginNameLine}>
            <Trans key={'setting.game.registered-games'} />
          </div>
          <div class={settingsStyles.cardCaption}>
            <Trans
              key={'setting.game.registered-games-count'}
              options={{ count: gameCount() }}
            />
          </div>
        </div>
        <ChevronRight class={settingsStyles.iconSmall} />
      </Card>

      <div class={settingsStyles.cardRow}>
        <span class={settingsStyles.sectionTitle}>
          <Trans key={'setting.game.search-game'} />
        </span>
        <Button onClick={() => refetch()} type="icon" variant="ghost">
          <LoaderCircle
            class={cx(
              settingsStyles.iconSmall,
              processList.loading && settingsStyles.iconSpin,
            )}
          />
        </Button>
      </div>

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
              class={cx(
                settingsStyles.iconSmall,
                processViewMode() === 'all' && settingsStyles.iconRotated,
              )}
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

      <Modal
        class={settingsStyles.modalNarrow}
        onClose={() => setTarget(null)}
        open={!!target()}
      >
        <div class={settingsStyles.modalTitle}>
          {t('setting.game.select-view-to-show-game-overlay')}
        </div>
        <For each={config()?.views}>
          {(view) => (
            <Card onClick={() => onAddGame(view.name)}>
              <div class={settingsStyles.checkPlaceholder} />
              <div class={settingsStyles.cardTitle}>{view.name}</div>
              <div class={settingsStyles.spacer} />
            </Card>
          )}
        </For>
      </Modal>
    </div>
  );
};

export default GameContainer;
