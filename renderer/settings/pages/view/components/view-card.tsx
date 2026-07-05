import { Trans, useTransContext } from '@jellybrick/solid-i18next';
import { Button, Input } from '@suis-ui/kit';

import icon from '../../../../../assets/icon_music.png';
import { PRESET_PREFIX } from '../../../../../common/constants';
import presetThemes from '../../../../../common/presets';
import { dangerButton } from '../../../../components/button';
import Card from '../../../../components/card';
import Selector from '../../../../components/select';
import Switch from '../../../../components/switch';
import { AnchorGrid } from '../../../components/anchor-grid';
import {
  PositionGrid,
  PositionGridIcon,
} from '../../../components/position-grid';
import {
  CardCaption,
  CardRow,
  CardRowBetween,
  CardTitle,
  Spacer,
  UnitInput,
} from '../../../components/setting-layout';

import type { Config, ThemeList } from '../../../../../common/schema';
import type { screen as electronScreen } from 'electron';

type ElectronScreenDisplay = ReturnType<
  typeof electronScreen.getPrimaryDisplay
>;

const getAllDisplays = () =>
  window.ipcRenderer.sendSync('get-all-screens') as ElectronScreenDisplay[];
const getPrimaryDisplay = () =>
  window.ipcRenderer.sendSync('get-primary-screen') as ElectronScreenDisplay;

export interface ViewCardProps {
  expanded: boolean;
  themeList: Required<ThemeList>;
  view: Config['views'][number];
  viewIndex: number;
  views: Config['views'];
  onExpand: (isExpanded: boolean) => void;
  onRename: () => void;
  onViewsChange: (views: Config['views']) => void;
}

const ViewCard = (props: ViewCardProps) => {
  const [t] = useTransContext();
  const displays = () => getAllDisplays();
  const getCurrentDisplay = (display: number | null) =>
    displays().find((it) => it.id === display) ?? getPrimaryDisplay();
  const selectedTheme = () => {
    if (props.view.theme.startsWith(PRESET_PREFIX)) {
      return presetThemes[props.view.theme.replace(PRESET_PREFIX, '')];
    }

    return props.themeList[props.view.theme];
  };
  const updateView = (update: (views: Config['views']) => void) => {
    const newViews = [...props.views];
    update(newViews);
    props.onViewsChange(newViews);
  };

  return (
    <Card
      expand={props.expanded}
      setExpand={props.onExpand}
      subCards={[
        <CardRow>
          <CardTitle>
            <Trans key={'setting.theme.theme'} />
          </CardTitle>
          <Spacer />
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
              updateView((views) => {
                views[props.viewIndex].theme = newTheme;
              });
            }}
            options={[
              ...Object.keys(presetThemes).map(
                (name) => `${PRESET_PREFIX}${name}`,
              ),
              ...Object.keys(props.themeList),
            ]}
            value={props.view.theme}
          />
        </CardRow>,
        <AnchorGrid
          isAnchorEnabled={(anchor) =>
            !!selectedTheme()?.position.availableAnchor.includes(anchor)
          }
          isAnchorSelected={(anchor) => props.view.position.anchor === anchor}
          onSelectAnchor={(anchor) => {
            updateView((views) => {
              views[props.viewIndex].position.anchor = anchor;
            });
          }}
        />,
        <PositionGrid>
          <div />
          <UnitInput>
            <Input
              onChange={(event) => {
                updateView((views) => {
                  views[props.viewIndex].position.top = Number(
                    event.target.value,
                  );
                });
              }}
              placeholder={t('setting.position.top-margin')}
              type={'number'}
              value={props.view.position.top ?? undefined}
              w="100%"
            />
            <span>px</span>
          </UnitInput>
          <div />
          <UnitInput>
            <Input
              onChange={(event) => {
                updateView((views) => {
                  views[props.viewIndex].position.left = Number(
                    event.target.value,
                  );
                });
              }}
              placeholder={t('setting.position.left-margin')}
              type={'number'}
              value={props.view.position.left ?? undefined}
              w="100%"
            />
            <span>px</span>
          </UnitInput>
          <PositionGridIcon alt={'Icon'} src={icon} />
          <UnitInput>
            <Input
              onChange={(event) => {
                updateView((views) => {
                  views[props.viewIndex].position.right = Number(
                    event.target.value,
                  );
                });
              }}
              placeholder={t('setting.position.right-margin')}
              type={'number'}
              value={props.view.position.right ?? undefined}
              w="100%"
            />
            <span>px</span>
          </UnitInput>
          <div />
          <UnitInput>
            <Input
              onChange={(event) => {
                updateView((views) => {
                  views[props.viewIndex].position.bottom = Number(
                    event.target.value,
                  );
                });
              }}
              placeholder={t('setting.position.bottom-margin')}
              type={'number'}
              value={props.view.position.bottom ?? undefined}
              w="100%"
            />
            <span>px</span>
          </UnitInput>
        </PositionGrid>,
        <CardRow>
          <CardTitle>
            <Trans key={'setting.position.select-monitor-to-display-lyrics'} />
          </CardTitle>
          <Spacer />
          <Selector
            onChange={(value, displayIndex) => {
              const display =
                displayIndex === 0 ? null : displays()[displayIndex - 1].id;

              updateView((views) => {
                views[props.viewIndex].position.display = display;
              });
            }}
            options={[
              t('setting.position.use-primary-monitor'),
              ...displays().map(
                (display, index) => `${index + 1} - ${display.label}`,
              ),
            ]}
            value={
              !props.view.position.display
                ? t('setting.position.use-primary-monitor')
                : displays().find(
                      (display) => display.id === props.view.position.display,
                    )
                  ? t('setting.position.monitor-name-with-index', {
                      index:
                        displays().findIndex(
                          (display) =>
                            display.id ===
                            getCurrentDisplay(props.view.position.display).id,
                        ) + 1,
                      name: getCurrentDisplay(props.view.position.display)
                        .label,
                    })
                  : t('setting.position.unknown-monitor', {
                      id: props.view.position.display,
                    })
            }
          />
        </CardRow>,
        <CardRowBetween>
          <Button onClick={props.onRename} variant="ghost">
            <Trans key={'setting.view.rename-view'} />
          </Button>
          <Button
            class={dangerButton}
            onClick={() => {
              updateView((views) => {
                views.splice(props.viewIndex, 1);
              });
            }}
            variant="primary"
          >
            <Trans key={'common.delete'} />
          </Button>
        </CardRowBetween>,
      ]}
    >
      <CardTitle>
        <div>{props.view.name}</div>
        <CardCaption>
          <Trans key={'setting.view.applied-theme'} />
          {': '}
          {props.view.theme.startsWith(PRESET_PREFIX)
            ? t(
                `setting.theme.preset.${props.view.theme.replace(PRESET_PREFIX, '')}`,
              )
            : props.view.theme}
        </CardCaption>
      </CardTitle>
      <Spacer />
      <Switch
        onChange={(checked) => {
          updateView((views) => {
            views[props.viewIndex].enabled = checked;
          });
        }}
        value={props.view.enabled}
      />
    </Card>
  );
};

export default ViewCard;
