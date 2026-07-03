import { Trans } from '@jellybrick/solid-i18next';
import { useNavigate } from '@solidjs/router';
import { Button } from '@suis-ui/kit';
import { t } from 'i18next';
import { ChevronRight } from 'lucide-solid';
import { createEffect, createSignal, For, type JSX } from 'solid-js';

import Card from '../../components/Card';
import * as componentStyles from '../../components/components.css';
import Modal from '../../components/Modal';
import useConfig from '../../hooks/useConfig';
import useGameList from '../../hooks/useGameList';
import GameCard from '../components/GameCard';
import * as settingsStyles from '../settings.css';

interface GameList {
  path: string;
  name: string;
  icon: string;
  theme: string;
}

const GameListContainer = () => {
  const navigate = useNavigate();
  const [gameList, setGameList] = useGameList();
  const [config] = useConfig();

  const [fileInput, setFileInput] = createSignal<HTMLInputElement | null>(null);
  const [availableGameList, setAvailableGameList] = createSignal<GameList[]>(
    [],
  );
  const [gameOpen, setGameOpen] = createSignal(false);
  const [target, setTarget] = createSignal<string | null>(null);
  const [file, setFile] = createSignal<File | null>(null);

  const updateAvailableGameList = async () => {
    const result: GameList[] = [];

    Object.entries(gameList()).forEach(([theme, value]) => {
      value.forEach(({ name, path }) => {
        result.push({
          path,
          name,
          icon: '',
          theme,
        });
      });
    });

    await Promise.all(
      result.map(async (data) => {
        data.icon = (await window.ipcRenderer.invoke(
          'get-icon',
          data.path,
        )) as string;
      }),
    );

    setAvailableGameList(result);
  };

  createEffect(() => {
    updateAvailableGameList();
  });

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

  const onSelectGame: JSX.InputEventHandlerUnion<
    HTMLInputElement,
    InputEvent
  > = (event) => {
    if (!event.target.files) return;

    const file = event.target.files.item(0);
    if (!file) return;

    const filePath = window.getPathForFile(file);
    const isEXE = /\.(exe)$/i.test(filePath);
    if (!isEXE) return;

    setFile(file);
    setTimeout(() => {
      setGameOpen(true);
    }, 0);
  };
  const onAddGame = (viewName: string) => {
    const data = file();

    if (!data) return;
    const path = window.getPathForFile(data);

    const list = { ...gameList() };
    if (!list[viewName]) {
      list[viewName] = [
        {
          name: data.name,
          path,
        },
      ];
    } else {
      list[viewName].push({
        name: data.name,
        path,
      });
    }

    setGameList(list, false);
    setFile(null);
    setGameOpen(false);
    const input = fileInput();
    if (input) input.value = '';
  };
  const onApplyTheme = (viewName: string) => {
    const path = target();
    if (!path) return;

    const list = { ...gameList() };
    const key = Object.keys(list).find((key) =>
      list[key].some((it) => it.path === path),
    );
    if (!key) return;

    const index = list[key].findIndex((it) => it.path === path);
    if (index < 0) return;

    const value = list[key][index];
    list[key].splice(index, 1);
    list[viewName] ??= [];
    list[viewName].push(value);

    setGameList(list, false);
    setTarget(null);
  };
  const onGamePage = () => {
    navigate('/game-overlay');
  };

  return (
    <div class={settingsStyles.pageRoot}>
      <div class={settingsStyles.pageTitleRow}>
        <span
          class={settingsStyles.pageTitleLink}
          onClick={onGamePage}
        >
          <Trans key={'setting.title.game-overlay'} />
        </span>
        <ChevronRight class={settingsStyles.iconSmall} />
        <span>
          <Trans key={'setting.game.list-of-registered-games'} />
        </span>
      </div>
      <div class={settingsStyles.sectionTitle}>
        <Trans key={'setting.game.registered-game-list.description'} />
      </div>

      <For each={availableGameList()}>
        {(game) => (
          <GameCard icon={game.icon} name={game.name} path={game.path}>
            <Button onClick={() => setTarget(game.path)} variant="ghost">
              <div class={settingsStyles.gameThemeButtonContent}>
                <span class={settingsStyles.cardCaption}>적용된 테마</span>
                <span>{game.theme}</span>
              </div>
            </Button>
            <Button
              class={componentStyles.dangerButton}
              onClick={() => onRemoveGame(game.path)}
              variant="primary"
            >
              <Trans key={'setting.game.unregister-game'} />
            </Button>
          </GameCard>
        )}
      </For>
      <label>
        <Button as="span" variant="primary">
          <Trans key={'setting.game.registered-game-list.adding-manually'} />
        </Button>
        <input
          accept={'.exe'}
          class={settingsStyles.hiddenInput}
          id={'game-selector'}
          onInput={onSelectGame}
          ref={setFileInput}
          type={'file'}
        />
      </label>
      <Modal
        class={settingsStyles.modalNarrow}
        onClose={() => setGameOpen(false)}
        open={gameOpen()}
      >
        <div class={settingsStyles.modalTitle}>
          {t('setting.game.select-view-to-show-game-overlay')}
        </div>
        <For each={config()?.views}>
          {(view) => (
            <Card
              onClick={() => onAddGame(view.name)}
            >
              <div class={settingsStyles.checkPlaceholder} />
              <div class={settingsStyles.cardTitle}>{view.name}</div>
              <div class={settingsStyles.spacer} />
            </Card>
          )}
        </For>
      </Modal>
      <Modal
        class={settingsStyles.modalNarrow}
        onClose={() => setTarget(null)}
        open={target() !== null}
      >
        <div class={settingsStyles.modalTitle}>
          {t('setting.game.select-view-to-show-game-overlay')}
        </div>
        <For each={config()?.views}>
          {(view) => (
            <Card
              onClick={() => onApplyTheme(view.name)}
            >
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

export default GameListContainer;
