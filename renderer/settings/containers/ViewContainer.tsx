import { Trans, useTransContext } from '@jellybrick/solid-i18next';
import { Button, Input } from '@suis-ui/kit';
import { createSignal, For } from 'solid-js';

import icon from '../../../assets/icon_music.png';
import { DEFAULT_CONFIG, PRESET_PREFIX } from '../../../common/constants';
import presetThemes from '../../../common/presets';
import Card from '../../components/Card';
import * as componentStyles from '../../components/components.css';
import Modal from '../../components/Modal';
import Selector from '../../components/Select';
import Switch from '../../components/Switch';
import useConfig from '../../hooks/useConfig';
import useGameList from '../../hooks/useGameList';
import useThemeList from '../../hooks/useThemeList';
import { cx } from '../../utils/classNames';
import * as settingsStyles from '../settings.css';

import type { screen as electronScreen } from 'electron';

type ElectronScreenDisplay = ReturnType<
  typeof electronScreen.getPrimaryDisplay
>;
const getAllDisplays = () =>
  window.ipcRenderer.sendSync('get-all-screens') as ElectronScreenDisplay[];
const getPrimaryDisplay = () =>
  window.ipcRenderer.sendSync('get-primary-screen') as ElectronScreenDisplay;

const anchorClass = (
  anchor: string,
  enabled: boolean,
  selected: boolean,
) =>
  cx(
    settingsStyles.anchorCard,
    anchor.includes('top') && settingsStyles.anchorTop,
    !anchor.includes('top') &&
      !anchor.includes('bottom') &&
      settingsStyles.anchorMiddle,
    anchor.includes('bottom') && settingsStyles.anchorBottom,
    anchor.includes('left') && settingsStyles.anchorLeft,
    !anchor.includes('left') &&
      !anchor.includes('right') &&
      settingsStyles.anchorCenter,
    anchor.includes('right') && settingsStyles.anchorRight,
    !enabled && settingsStyles.anchorDisabled,
    selected && settingsStyles.anchorSelected,
  );

export const ViewContainer = () => {
  const [config, setConfig] = useConfig();
  const [themeList] = useThemeList();
  const [gameList, setGameList] = useGameList();
  const [t] = useTransContext();

  const [expand, setExpand] = createSignal(-1);
  const [target, setTarget] = createSignal<string | null>(null);
  const [name, setName] = createSignal('');
  const [nameConflictOpen, setNameConflictOpen] = createSignal(false);

  const views = () => config()?.views ?? [];

  const displays = () => getAllDisplays();
  const getCurrentDisplay = (display: number | null) =>
    displays().find((it) => it.id === display) ?? getPrimaryDisplay();

  const onAddView = () => {
    const newName = t('setting.view.new-view');
    let suffix = 1;

    while (views().some((view) => view.name === `${newName} ${suffix}`)) {
      suffix += 1;
    }

    setConfig({
      views: [
        ...views(),
        {
          ...DEFAULT_CONFIG.views[0],
          name: `${newName} ${suffix}`,
        },
      ],
    });
  };
  const onRenameView = () => {
    const targetName = target();
    const newName = name();

    if (!targetName || !newName) return;
    const newViews = [...views()];
    const targetIndex = newViews.findIndex((view) => view.name === targetName);
    const newNameConflict = newViews.some((view) => view.name === newName);

    if (targetIndex < 0) return;
    if (newNameConflict) {
      setNameConflictOpen(true);
      return;
    }
    newViews[targetIndex].name = newName;

    const newGameList = { ...gameList() };
    if (newGameList[targetName]) {
      newGameList[newName] = newGameList[targetName];
      delete newGameList[targetName];

      setGameList(newGameList, false);
    }

    setConfig({
      views: newViews,
    });
    setTarget(null);
  };

  return (
    <div class={settingsStyles.pageRoot}>
      <div class={settingsStyles.pageTitle}>
        <Trans key={'setting.title.view'} />
      </div>
      <div class={settingsStyles.sectionTitle}>
        <Trans key={'setting.view.list'} />
      </div>
      <For each={views()}>
        {(view, index) => (
          <Card
            
            expand={expand() === index()}
            setExpand={(isExpand) => {
              if (isExpand) setExpand(index());
              else setExpand(-1);
            }}
            subCards={[
              <div class={settingsStyles.cardRow}>
                <div class={settingsStyles.cardTitle}>
                  <Trans key={'setting.theme.theme'} />
                </div>
                <div class={settingsStyles.spacer} />
                <Selector
                  format={(theme) => {
                    if (theme.startsWith(PRESET_PREFIX)) {
                      return t(
                        `setting.theme.preset.${theme.replace(PRESET_PREFIX, '')}`,
                      );
                    }

                    return theme;
                  }}
                  onChange={(newTheme) => {
                    const newViews = [...views()];
                    newViews[index()].theme = newTheme;

                    setConfig({
                      views: newViews,
                    });
                  }}
                  options={[
                    ...Object.keys(presetThemes).map(
                      (name) => `${PRESET_PREFIX}${name}`,
                    ),
                    ...Object.keys(themeList()),
                  ]}
                  value={view.theme}
                />
              </div>,
              <div class={settingsStyles.positionGrid}>
                <For
                  each={[
                    'top-left' as const,
                    'top' as const,
                    'top-right' as const,
                    'left' as const,
                    'center' as const,
                    'right' as const,
                    'bottom-left' as const,
                    'bottom' as const,
                    'bottom-right' as const,
                  ]}
                >
                  {(anchor) => {
                    let theme = themeList()[view.theme];
                    if (view.theme.startsWith(PRESET_PREFIX)) {
                      theme =
                        presetThemes[view.theme.replace(PRESET_PREFIX, '')];
                    }

                    return (
                      <Card
                        class={anchorClass(
                          anchor,
                          !!theme?.position.availableAnchor.includes(anchor),
                          view.position.anchor === anchor,
                        )}
                        onClick={() => {
                          const isEnable =
                            theme?.position.availableAnchor.includes(anchor);
                          if (!isEnable) return;

                          const newViews = [...views()];
                          newViews[index()].position.anchor = anchor;

                          setConfig({
                            views: newViews,
                          });
                        }}
                      >
                        <Trans key={`setting.position.${anchor}`} />
                      </Card>
                    );
                  }}
                </For>
              </div>,
              <div class={settingsStyles.positionGrid}>
                <div />
                <div class={settingsStyles.unitInput}>
                  <Input
                    onChange={(event) => {
                      const newViews = [...views()];
                      newViews[index()].position.top = Number(
                        event.target.value,
                      );

                      setConfig({
                        views: newViews,
                      });
                    }}
                    placeholder={t('setting.position.top-margin')}
                    type={'number'}
                    value={view.position.top ?? undefined}
                    w="100%"
                  />
                  <span>px</span>
                </div>
                <div />
                <div class={settingsStyles.unitInput}>
                  <Input
                    onChange={(event) => {
                      const newViews = [...views()];
                      newViews[index()].position.left = Number(
                        event.target.value,
                      );

                      setConfig({
                        views: newViews,
                      });
                    }}
                    placeholder={t('setting.position.left-margin')}
                    type={'number'}
                    value={view.position.left ?? undefined}
                    w="100%"
                  />
                  <span>px</span>
                </div>
                <img
                  alt={'Icon'}
                  class={settingsStyles.positionIcon}
                  src={icon}
                />
                <div class={settingsStyles.unitInput}>
                  <Input
                    onChange={(event) => {
                      const newViews = [...views()];
                      newViews[index()].position.right = Number(
                        event.target.value,
                      );

                      setConfig({
                        views: newViews,
                      });
                    }}
                    placeholder={t('setting.position.right-margin')}
                    type={'number'}
                    value={view.position.right ?? undefined}
                    w="100%"
                  />
                  <span>px</span>
                </div>
                <div />
                <div class={settingsStyles.unitInput}>
                  <Input
                    onChange={(event) => {
                      const newViews = [...views()];
                      newViews[index()].position.bottom = Number(
                        event.target.value,
                      );

                      setConfig({
                        views: newViews,
                      });
                    }}
                    placeholder={t('setting.position.bottom-margin')}
                    type={'number'}
                    value={view.position.bottom ?? undefined}
                    w="100%"
                  />
                  <span>px</span>
                </div>
              </div>,
              <div class={settingsStyles.cardRow}>
                <div class={settingsStyles.cardTitle}>
                  <Trans
                    key={'setting.position.select-monitor-to-display-lyrics'}
                  />
                </div>
                <div class={settingsStyles.spacer} />
                <Selector
                  onChange={(value, displayIndex) => {
                    const display =
                      displayIndex === 0
                        ? null
                        : displays()[displayIndex - 1].id;
                    const newViews = [...views()];
                    newViews[index()].position.display = display;

                    setConfig({
                      views: newViews,
                    });
                  }}
                  options={[
                    t('setting.position.use-primary-monitor'),
                    ...displays().map(
                      (display, index) => `${index + 1} - ${display.label}`,
                    ),
                  ]}
                  value={
                    !view.position.display
                      ? t('setting.position.use-primary-monitor')
                      : displays().find(
                            (display) => display.id === view.position.display,
                          )
                        ? t('setting.position.monitor-name-with-index', {
                            index:
                              displays().findIndex(
                                (display) =>
                                  display.id ===
                                  getCurrentDisplay(view.position.display).id,
                              ) + 1,
                            name: getCurrentDisplay(view.position.display)
                              .label,
                          })
                        : t('setting.position.unknown-monitor', {
                            id: view.position.display,
                          })
                  }
                />
              </div>,
              <div class={settingsStyles.cardRowBetween}>
                <Button
                  onClick={() => setTarget(view.name)}
                  variant="ghost"
                >
                  <Trans key={'setting.view.rename-view'} />
                </Button>
                <Button
                  class={componentStyles.dangerButton}
                  onClick={() => {
                    const newViews = [...views()];
                    newViews.splice(index(), 1);

                    setConfig({
                      views: newViews,
                    });
                  }}
                  variant="primary"
                >
                  <Trans key={'common.delete'} />
                </Button>
              </div>,
            ]}
          >
            <div class={settingsStyles.cardTitle}>
              <div>{view.name}</div>
              <div class={settingsStyles.cardCaption}>
                <Trans key={'setting.view.applied-theme'} />
                {': '}
                {view.theme.startsWith(PRESET_PREFIX)
                  ? t(
                      `setting.theme.preset.${view.theme.replace(PRESET_PREFIX, '')}`,
                    )
                  : view.theme}
              </div>
            </div>
            <div class={settingsStyles.spacer} />
            <Switch
              onChange={(checked) => {
                const newViews = [...views()];
                newViews[index()].enabled = checked;

                setConfig({
                  views: newViews,
                });
              }}
              value={view.enabled}
            />
          </Card>
        )}
      </For>

      <div class={settingsStyles.sectionTitle}>
        <Trans key={'setting.view.edit-view'} />
      </div>
      <Card >
        <Trans key={'setting.view.add-view'} />
        <div class={settingsStyles.spacer} />
        <Button onClick={onAddView} variant="primary">
          <Trans key={'setting.view.add-view'} />
        </Button>
      </Card>

      <Modal
        buttons={[
          {
            name: t('common.close'),
            onClick: () => setTarget(null),
          },
          {
            type: 'positive',
            name: t('common.okay'),
            onClick: onRenameView,
          },
        ]}
        onClose={() => setTarget(null)}
        open={target() !== null}
      >
        <div class={settingsStyles.modalTitle}>
          {t('setting.view.rename-alert-title')}
        </div>
        <div class={settingsStyles.modalBody}>
          {t('setting.view.rename-alert', { name: target() })}
        </div>
        <Input
          onChange={(event) => setName(event.target.value)}
          value={name()}
          w="100%"
        />
      </Modal>
      <Modal
        buttons={[
          {
            name: t('common.okay'),
            onClick: () => setNameConflictOpen(false),
          },
        ]}
        onClose={() => setNameConflictOpen(false)}
        open={nameConflictOpen()}
      >
        <div class={settingsStyles.modalTitle}>
          {t('setting.view.rename-conflict-title')}
        </div>
        <div class={settingsStyles.modalBody}>
          {t('setting.view.rename-conflict', { name: name() })}
        </div>
      </Modal>
    </div>
  );
};
