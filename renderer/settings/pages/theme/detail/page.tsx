import { Trans, useTransContext } from '@jellybrick/solid-i18next';
import { useNavigate, useParams } from '@solidjs/router';
import { Box, Button } from '@suis-ui/kit';
import { createSignal, onCleanup, onMount, Show, untrack } from 'solid-js';

import ColorPicker from './components/color-picker';
import LyricPreview from './components/lyric-preview';
import NumberField from './components/number-field';
import UserCSSEditor from './components/user-css-editor';
import * as styles from './page.css';

import icon from '../../../../../assets/icon_music.png';
import Card from '../../../../components/Card';
import Selector from '../../../../components/Select';
import Switch from '../../../../components/Switch';
import useConfig from '../../../../hooks/useConfig';
import useThemeList from '../../../../hooks/useThemeList';
import { useLyricsStyle } from '../../../../main/components/Lyrics';
import LyricsTransition from '../../../../main/components/LyricsTransition';
import { cx } from '../../../../utils/classNames';
import { userCSSTransitions } from '../../../../utils/userCSSSelectors';
import { AnchorGrid } from '../../../components/anchor-grid';
import {
  PositionGrid,
  PositionGridIcon,
} from '../../../components/position-grid';
import {
  CardCaptionLarge,
  CardColumn,
  CardDescription,
  CardRow,
  CardTitle,
  PageBreadcrumb,
  PageRoot,
  SectionStack,
  SectionTitle,
  Spacer,
} from '../../../components/setting-layout';

import type { StyleConfig } from '../../../../../common/schema';
import type { PartialDeep } from 'type-fest';

const ANIMATION_LIST = [
  'none',
  'fade',
  'pretty',
  'slide',
  'show-up',
  'scale',
  'slime',
  'custom',
];

export const ThemePage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [themeList, setThemeList] = useThemeList();
  const [t] = useTransContext();
  const [config, setConfig] = useConfig();

  const PREVIEW_TEXT_A = [
    t('setting.theme.animation.preview-text-a.0'),
    t('setting.theme.animation.preview-text-a.1'),
    t('setting.theme.animation.preview-text-a.2'),
  ];

  const PREVIEW_TEXT_B = [
    t('setting.theme.animation.preview-text-b.0'),
    t('setting.theme.animation.preview-text-b.1'),
    t('setting.theme.animation.preview-text-b.2'),
  ];

  const [fontList, setFontList] = createSignal<string[]>([]);
  const [animationPreview, setAnimationPreview] = createSignal(PREVIEW_TEXT_A);
  const [scrollY, setScrollY] = createSignal(0);
  const [previewOffset, setPreviewOffset] = createSignal(0);

  const themeName = () => decodeURIComponent(params.name!);
  const theme = () => themeList()[themeName()];
  const animation = () => {
    const configuredName = theme()?.animation ?? 'pretty';
    if (configuredName === 'custom') {
      return userCSSTransitions['transition-lyric'];
    }

    return `lyric-${configuredName}`;
  };

  let previewRef: HTMLDivElement | undefined;
  let parentRef: HTMLDivElement | undefined;
  let interval: ReturnType<typeof setInterval> | null = null;
  const onScroll = () => {
    setScrollY(parentRef?.scrollTop ?? 0);

    if (previewOffset() === 0 && previewRef) {
      setPreviewOffset(previewRef.offsetTop);
    }
  };
  onMount(() => {
    let isTick = false;
    interval = setInterval(() => {
      const nextPreview = untrack(() =>
        isTick ? PREVIEW_TEXT_A : PREVIEW_TEXT_B,
      );

      isTick = !isTick;
      setAnimationPreview(nextPreview);
    }, 1500);

    parentRef?.addEventListener('scroll', onScroll);
  });
  (async () => {
    const fontList = await window.getFont({ disableQuoting: true });
    if (!fontList.includes('Pretendard JP Variable'))
      fontList.push('Pretendard JP Variable');

    setFontList(fontList);
  })();
  onCleanup(() => {
    if (typeof interval === 'number') clearInterval(interval);
    parentRef?.removeEventListener('scroll', onScroll);
  });

  const getAnimationName = (value: string) => {
    if (value === 'none') return t('setting.theme.animation.none');
    if (value === 'fade') return t('setting.theme.animation.fade');
    if (value === 'pretty') return t('setting.theme.animation.pretty');
    if (value === 'slide') return t('setting.theme.animation.slide');
    if (value === 'show-up') return t('setting.theme.animation.show-up');
    if (value === 'scale') return t('setting.theme.animation.scale');
    if (value === 'slime') return t('setting.theme.animation.slime');
    if (value === 'custom') return t('setting.theme.animation.custom-css');

    return t('setting.theme.animation.unknown', {
      code: value,
    });
  };
  const setTheme = (style: PartialDeep<StyleConfig>) => {
    const nowThemeName = themeName();

    setThemeList(nowThemeName, style);
  };
  const onThemeListPage = () => {
    navigate('/theme');
  };
  const onExport = () => {
    const json = JSON.stringify(theme(), null, 2);
    const name = themeName();

    const link = document.createElement('a');
    const file = new Blob([json], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = `${name}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  useLyricsStyle(() => theme() ?? null, config);

  return (
    <PageRoot flushX ref={parentRef}>
      <PageBreadcrumb
        current={themeName() ?? t('setting.theme.unknown')}
        onParentClick={onThemeListPage}
        parent={<Trans key={'setting.title.theme'} />}
      />
      <Show when={theme()}>
        <div
          class={cx(
            styles.stickyPreview,
            scrollY() > previewOffset() && styles.stickyPreviewRaised,
          )}
          ref={previewRef}
        >
          <LyricPreview theme={theme()!} />
        </div>
      </Show>
      <SectionStack px="lg">
        <Card>
          <Trans key={'setting.theme.export-theme'} />
          <Spacer />
          <Button onClick={onExport} variant="primary">
            <Trans key={'setting.theme.export-as-file'} />
          </Button>
        </Card>
      </SectionStack>
      <SectionTitle px="lg">
        <Trans key={'setting.theme.generic-theme-settings'} />
      </SectionTitle>
      <SectionStack px="lg">
        <Card justify="between">
          <CardTitle>
            <Trans key={'setting.theme.font'} />
          </CardTitle>
          <Selector
            minWidth="210px"
            onChange={(value) => setTheme({ font: value })}
            options={fontList()}
            placeholder={t('setting.theme.font.placeholder')}
            style={{
              'font-family': theme()?.font,
            }}
            value={theme()?.font}
          />
        </Card>
        <Card justify="between">
          <CardTitle>
            <Trans key={'setting.theme.font-weight'} />
          </CardTitle>
          <Selector
            onChange={(value) => setTheme({ fontWeight: value })}
            options={[
              '100',
              '200',
              '300',
              '400',
              '500',
              '600',
              '700',
              '800',
              '900',
            ]}
            placeholder={'1-100'}
            style={{
              'font-family': theme()?.font,
              'font-weight': theme()?.fontWeight,
            }}
            value={theme()?.fontWeight ?? '400'}
            width="12rem"
          />
        </Card>
        <Card
          justify="between"
          subCards={[
            <CardColumn>
              <CardTitle>
                <Trans key={'setting.theme.preview'} />
              </CardTitle>
              <Box
                align="flex-start"
                direction="column"
                gap="lg"
                justify="flex-start"
                maxH="128px"
                pos="relative"
                w="100%"
              >
                <LyricsTransition
                  animation={animation()}
                  lyrics={animationPreview()}
                  status={'playing'}
                  style={`row-gap: ${theme()?.lyric.containerRowGap}rem;`}
                />
              </Box>
            </CardColumn>,
            <CardRow>
              <CardTitle>
                <Trans key={'setting.theme.select-animation'} />
              </CardTitle>
              <Spacer />
              <Selector
                format={getAnimationName}
                onChange={(value) => setTheme({ animation: value })}
                options={ANIMATION_LIST}
                placeholder={t('setting.theme.animation.placeholder')}
                value={theme()?.animation ?? 'pretty'}
                width="12rem"
              />
            </CardRow>,
            <CardRow>
              <CardTitle>
                <Trans key={'setting.theme.animation.at-once'} />
              </CardTitle>
              <Spacer />
              <Switch
                onChange={(checked) => setTheme({ animationAtOnce: checked })}
                value={theme()?.animationAtOnce}
              />
            </CardRow>,
          ]}
        >
          <CardTitle>
            <Trans key={'setting.theme.animation'} />
          </CardTitle>
          <Spacer />
          <CardCaptionLarge>
            {getAnimationName(theme()?.animation ?? 'pretty')}
          </CardCaptionLarge>
        </Card>
        <Card justify="between">
          <CardTitle>
            <Trans key={'setting.theme.proximity-opacity'} />
          </CardTitle>
          <NumberField
            onChange={(value) => setTheme({ proximityOpacity: value / 100 })}
            unit="%"
            value={(theme()?.proximityOpacity ?? 0) * 100}
          />
        </Card>
        <Card justify="between">
          <CardTitle>
            <Trans key={'setting.theme.proximity-sensitivity'} />
          </CardTitle>
          <NumberField
            onChange={(value) => setTheme({ proximitySensitivity: value })}
            value={theme()?.proximitySensitivity}
          />
        </Card>
        <Card justify="between">
          <CardTitle>
            <Trans key={'setting.theme.max-height'} />
          </CardTitle>
          <NumberField
            onChange={(value) => setTheme({ maxHeight: value })}
            unit="px"
            value={theme()?.maxHeight}
          />
        </Card>
        <Card justify="between">
          <CardTitle>
            <Trans
              key={'setting.theme.margin-between-lyrics-and-progressbar'}
            />
          </CardTitle>
          <NumberField
            onChange={(value) => setTheme({ rowGap: value })}
            unit="rem"
            value={theme()?.rowGap}
          />
        </Card>
        <Card>
          <CardTitle>
            <Trans key={'setting.position.select-to-show-now-playing-panel'} />
          </CardTitle>
          <Spacer />
          <Selector
            format={(value) =>
              value === 'true'
                ? t('setting.position.show-now-playing-panel')
                : t('setting.position.hide-now-playing-panel')
            }
            onChange={(value) =>
              setTheme({ nowPlaying: { visible: value === 'true' } })
            }
            options={['true', 'false']}
            value={theme()?.nowPlaying?.visible?.toString() ?? 'true'}
          />
        </Card>
        <Card
          subCards={[
            <PositionGrid>
              <div />
              <NumberField
                onChange={async (value) => {
                  setTheme({ position: { top: value } });

                  await window.ipcRenderer.invoke('update-window');
                }}
                placeholder={t('setting.position.top-margin')}
                unit="px"
                value={theme()?.position.top ?? undefined}
                width="100%"
              />
              <div />
              <NumberField
                onChange={async (value) => {
                  setTheme({
                    position: { left: value },
                  });

                  await window.ipcRenderer.invoke('update-window');
                }}
                placeholder={t('setting.position.left-margin')}
                unit="px"
                value={theme()?.position.left ?? undefined}
                width="100%"
              />
              <PositionGridIcon alt={'Icon'} src={icon} />
              <NumberField
                onChange={async (value) => {
                  setTheme({
                    position: { right: value },
                  });

                  await window.ipcRenderer.invoke('update-window');
                }}
                placeholder={t('setting.position.right-margin')}
                unit="px"
                value={theme()?.position.right ?? undefined}
                width="100%"
              />
              <div />
              <NumberField
                onChange={async (value) => {
                  setTheme({
                    position: { bottom: value },
                  });

                  await window.ipcRenderer.invoke('update-window');
                }}
                placeholder={t('setting.position.bottom-margin')}
                unit="px"
                value={theme()?.position.bottom ?? undefined}
                width="100%"
              />
            </PositionGrid>,
          ]}
        >
          <CardTitle>
            <Trans key={'setting.position.adjust-margin'} />
          </CardTitle>
          <Spacer />
          <CardCaptionLarge>
            {theme()?.position.top}px / {theme()?.position.right}px /{' '}
            {theme()?.position.bottom}px / {theme()?.position.left}px
          </CardCaptionLarge>
        </Card>
        <Card
          subCards={[
            <AnchorGrid
              isAnchorSelected={(anchor) =>
                !!theme()?.position.availableAnchor.includes(anchor)
              }
              onSelectAnchor={(anchor) => {
                const list = theme()?.position.availableAnchor ?? [];

                if (list.includes(anchor)) {
                  const newAnchorList = list.filter((item) => item !== anchor);
                  if (newAnchorList.length === 0) newAnchorList.push('center');

                  const views =
                    config()?.views?.map((view) => {
                      const anchor = view.position.anchor;
                      return {
                        ...view,
                        position: {
                          ...view.position,
                          anchor: newAnchorList.includes(anchor)
                            ? anchor
                            : newAnchorList[0],
                        },
                      };
                    }) ?? [];

                  setConfig({ views });
                  setTheme({
                    position: { availableAnchor: newAnchorList },
                  });
                } else {
                  setTheme({
                    position: { availableAnchor: [...list, anchor] },
                  });
                }
              }}
            />,
          ]}
        >
          <CardTitle>
            <Trans key={'setting.position.available-position'} />
          </CardTitle>
        </Card>
      </SectionStack>
      <SectionTitle px="lg">
        <Trans key={'setting.theme.now-playing'} />
      </SectionTitle>
      <SectionStack px="lg">
        <Card justify="between">
          <CardTitle>
            <Trans key={'setting.theme.font-size'} />
          </CardTitle>
          <NumberField
            onChange={(value) =>
              setTheme({
                nowPlaying: { fontSize: value },
              })
            }
            unit="px"
            value={theme()?.nowPlaying.fontSize}
          />
        </Card>
        <Card justify="between">
          <CardTitle>
            <Trans key={'setting.theme.font-color'} />
          </CardTitle>
          <ColorPicker
            onColorChange={(color) => setTheme({ nowPlaying: { color } })}
            value={theme()?.nowPlaying.color}
          />
        </Card>
        <Card justify="between">
          <CardTitle>
            <Trans key={'setting.theme.background-color'} />
          </CardTitle>
          <ColorPicker
            onColorChange={(color) =>
              setTheme({ nowPlaying: { background: color } })
            }
            value={theme()?.nowPlaying.background}
          />
        </Card>
        <Card justify="between">
          <CardTitle>
            <Trans key={'setting.theme.progressbar-color'} />
          </CardTitle>
          <ColorPicker
            onColorChange={(color) =>
              setTheme({ nowPlaying: { backgroundProgress: color } })
            }
            value={theme()?.nowPlaying.backgroundProgress}
          />
        </Card>
        <Card justify="between">
          <CardTitle>
            <Trans key={'setting.theme.max-width'} />
          </CardTitle>
          <NumberField
            onChange={(value) =>
              setTheme({
                nowPlaying: { maxWidth: value },
              })
            }
            unit="px"
            value={theme()?.nowPlaying.maxWidth}
          />
        </Card>
        <Card justify="between">
          <CardTitle>
            <Trans key={'setting.theme.stopped-opacity'} />
          </CardTitle>
          <NumberField
            onChange={(value) =>
              setTheme({
                nowPlaying: {
                  stoppedOpacity: value / 100,
                },
              })
            }
            unit="%"
            value={(theme()?.nowPlaying.stoppedOpacity ?? 0) * 100}
          />
        </Card>
      </SectionStack>
      <SectionTitle px="lg">
        <Trans key={'setting.theme.lyric'} />
      </SectionTitle>
      <SectionStack px="lg">
        <Card justify="between">
          <CardTitle>
            <Trans key={'setting.theme.font-size'} />
          </CardTitle>
          <NumberField
            onChange={(value) => setTheme({ lyric: { fontSize: value } })}
            unit="px"
            value={theme()?.lyric.fontSize}
          />
        </Card>
        <Card justify="between">
          <CardTitle>
            <Trans key={'setting.theme.font-color'} />
          </CardTitle>
          <ColorPicker
            onColorChange={(color) => setTheme({ lyric: { color } })}
            value={theme()?.lyric.color}
          />
        </Card>
        <Card justify="between">
          <CardTitle>
            <Trans key={'setting.theme.background-color'} />
          </CardTitle>
          <ColorPicker
            onColorChange={(color) =>
              setTheme({ lyric: { background: color } })
            }
            value={theme()?.lyric.background}
          />
        </Card>
        <Card justify="between">
          <CardTitle>
            <Trans key={'setting.theme.stopped-opacity'} />
          </CardTitle>
          <NumberField
            onChange={(value) =>
              setTheme({
                lyric: { stoppedOpacity: value / 100 },
              })
            }
            unit="%"
            value={(theme()?.lyric.stoppedOpacity ?? 0) * 100}
          />
        </Card>
        <Card justify="between">
          <CardTitle>
            <Trans key={'setting.theme.margin-between-lyrics-containers'} />
          </CardTitle>
          <NumberField
            onChange={(value) =>
              setTheme({
                lyric: { containerRowGap: value },
              })
            }
            unit="rem"
            value={theme()?.lyric.containerRowGap}
          />
        </Card>
        <Card justify="between">
          <CardTitle>
            <Trans
              key={'setting.theme.margin-between-multiple-lyrics-containers'}
            />
          </CardTitle>
          <NumberField
            onChange={(value) =>
              setTheme({
                lyric: {
                  multipleContainerRowGap: value,
                },
              })
            }
            unit="rem"
            value={theme()?.lyric.multipleContainerRowGap}
          />
        </Card>
        <Card>
          <CardTitle>
            <Trans
              key={'setting.position.select-orientation-to-display-lyrics'}
            />
          </CardTitle>
          <Spacer />
          <Selector
            format={(value) =>
              value === 'column'
                ? t('setting.position.from-top-to-bottom')
                : t('setting.position.from-bottom-to-top')
            }
            onChange={(value) => setTheme({ lyric: { direction: value } })}
            options={['column', 'column-reverse']}
            value={theme()?.lyric?.direction ?? 'column'}
          />
        </Card>
        <Card justify="between">
          <CardTitle>
            <Trans key={'setting.general.next-lyric-count'} />
          </CardTitle>
          <NumberField
            min={0}
            onChange={(value) =>
              setTheme({
                lyric: { nextLyric: Math.round(value) },
              })
            }
            step={1}
            value={theme()?.lyric.nextLyric}
          />
        </Card>
        <Card justify="between">
          <CardTitle>
            <Trans key={'setting.general.previous-lyric-count'} />
          </CardTitle>
          <NumberField
            min={0}
            onChange={(value) =>
              setTheme({
                lyric: {
                  previousLyric: Math.round(value),
                },
              })
            }
            step={1}
            value={theme()?.lyric.previousLyric}
          />
        </Card>
        <Card justify="between">
          <CardTitle>
            <Trans key={'setting.theme.next-lyrics-opacity'} />
          </CardTitle>
          <NumberField
            onChange={(value) =>
              setTheme({
                lyric: { nextLyricOpacity: value / 100 },
              })
            }
            unit="%"
            value={(theme()?.lyric.nextLyricOpacity ?? 0) * 100}
          />
        </Card>
        <Card justify="between">
          <CardTitle>
            <Trans key={'setting.theme.previous-lyrics-opacity'} />
          </CardTitle>
          <NumberField
            onChange={(value) =>
              setTheme({
                lyric: {
                  previousLyricOpacity: value / 100,
                },
              })
            }
            unit="%"
            value={(theme()?.lyric.previousLyricOpacity ?? 0) * 100}
          />
        </Card>
        <Card justify="between">
          <CardTitle>
            <Trans key={'setting.theme.next-lyrics-scale'} />
          </CardTitle>
          <NumberField
            onChange={(value) =>
              setTheme({
                lyric: { nextLyricScale: value / 100 },
              })
            }
            unit="%"
            value={(theme()?.lyric.nextLyricScale ?? 0) * 100}
          />
        </Card>
        <Card justify="between">
          <CardTitle>
            <Trans key={'setting.theme.previous-lyrics-scale'} />
          </CardTitle>
          <NumberField
            onChange={(value) =>
              setTheme({
                lyric: {
                  previousLyricScale: value / 100,
                },
              })
            }
            unit="%"
            value={(theme()?.lyric.previousLyricScale ?? 0) * 100}
          />
        </Card>
        <Card justify="between">
          <CardColumn>
            <CardTitle>
              <Trans key={'setting.theme.prevnext-lyric-threshold'} />
            </CardTitle>
            <CardDescription>
              <Trans
                key={'setting.theme.prevnext-lyric-threshold-description'}
              />
            </CardDescription>
          </CardColumn>
          <NumberField
            onChange={(value) =>
              setTheme({
                lyric: { prevNextLyricThreshold: value },
              })
            }
            value={theme()?.lyric.prevNextLyricThreshold ?? -1}
          />
        </Card>
      </SectionStack>
      <SectionTitle px="lg">
        <Trans key={'setting.theme.theme'} />
      </SectionTitle>
      <SectionStack px="lg">
        <Card
          justify="between"
          subCards={[
            <UserCSSEditor
              css={theme()?.userCSS}
              onUpdate={(value) => setTheme({ userCSS: value })}
            />,
          ]}
        >
          <CardColumn>
            <CardTitle>
              <Trans key={'setting.theme.user-css'} />
            </CardTitle>
          </CardColumn>
        </Card>
      </SectionStack>
    </PageRoot>
  );
};
