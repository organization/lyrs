import { Trans, useTransContext } from '@jellybrick/solid-i18next';
import { Box, Input } from '@suis-ui/kit';
import { Marquee } from '@suyongs/solid-utility';
import { createEffect, createMemo, For, Match, Show, Switch } from 'solid-js';
import { Entry } from 'tstl';

import * as lyricStyles from './lyrics.css';

import { type LyricMapperMode } from '../../common/schema';
import { getLyricMapperId } from '../../common/utils';
import Card from '../components/Card';
import {
  type LyricMode,
  usePlayingInfo,
} from '../components/PlayingInfoProvider';
import Selector from '../components/Select';
import { Slider } from '../components/Slider';
import useLyric from '../hooks/useLyric';
import useLyricMapper from '../hooks/useLyricMapper';
import LyricProgressBar from '../main/components/LyricProgressBar';
import { cx } from '../utils/classNames';

const SideBar = () => {
  const {
    coverUrl,
    title,
    lyrics,
    playerLyrics,
    lyricData,
    lyricMode,
    isMapped,
  } = usePlayingInfo();
  const [, lyricTime] = useLyric();
  const [lyricMapper, setLyricMapper] = useLyricMapper();
  const [t] = useTransContext();

  const lyricMapperItem = () =>
    lyricMapper()[getLyricMapperId(title(), coverUrl())];
  const lyricItems = createMemo(() => {
    if (lyricMode() === 'player') {
      return Object.entries(playerLyrics() ?? {}).map(
        ([time, lyrics]) => new Entry(~~time, lyrics),
      );
    } else {
      return lyrics()?.toJSON() ?? [];
    }
  });

  createEffect(() => {
    const time = lyricTime();

    document.querySelector(`#lyric-${time ?? '0'}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });

  const onChangeLyricMode = (mode: LyricMode) => {
    let newMode: LyricMapperMode | null = null;
    if (mode === 'player') newMode = { type: 'player' };
    if (mode === 'none') newMode = { type: 'none' };

    const newMapper = {
      [getLyricMapperId(title(), coverUrl())]: {
        mode: newMode,
      },
    };

    setLyricMapper(newMapper);
  };

  return (
    <div class={lyricStyles.sidebarRoot}>
      <div class={lyricStyles.sidebarTitle}>
        <Trans key={'lyrics.current-playing-track'} />
      </div>
      <LyricProgressBar class={lyricStyles.progress} />
      <div class={lyricStyles.sidebarTitleSpaced}>
        <Trans key={'lyrics.current-applied-lyric'} />
      </div>
      <Card
        subCards={[
          <div class={lyricStyles.sidebarRow}>
            <Trans key={'lyrics.mode'} />
            <Selector
              format={(mode) => t(`lyrics.mode.${mode}`)}
              mode={'select'}
              onChange={onChangeLyricMode}
              options={['auto', 'player', 'none'] as LyricMode[]}
              value={lyricMode()}
            />
          </div>,
          <div class={lyricStyles.sidebarDelayEditor}>
            <div class={lyricStyles.sidebarRow}>
              <Trans key={'lyrics.delay'} />
              <Box align="center" direction="row" gap="xs">
                <Input
                  onChange={(e) => {
                    setLyricMapper({
                      [getLyricMapperId(title(), coverUrl())]: {
                        delay: ~~(e.currentTarget.valueAsNumber ?? 0),
                      },
                    });
                  }}
                  type={'number'}
                  value={lyricMapperItem()?.delay ?? 0}
                  w="20ch"
                />
                <Box text="caption">ms</Box>
              </Box>
            </div>
            <Slider
              label={[
                { value: -3000, label: t('lyrics.delay.slowly') },
                { value: 0, label: t('lyrics.delay.default') },
                { value: 3000, label: t('lyrics.delay.fastly') },
              ]}
              max={3000}
              min={-3000}
              onChange={(value) => {
                setLyricMapper({
                  [getLyricMapperId(title(), coverUrl())]: {
                    delay: value,
                  },
                });
              }}
              step={100}
              value={lyricMapperItem()?.delay ?? 0}
              width="100%"
            />
          </div>,
        ]}
      >
        <div class={lyricStyles.currentLyricSummary}>
          <Show when={lyricData()}>
            <Marquee class={lyricStyles.marquee} gap={32}>
              <div class={lyricStyles.resultMeta}>
                <Trans key={'lyrics.lyric-id'} />: {lyricData()?.id ?? 'N/A'}
                {' · '}
                <Trans key={'lyrics.lyric-author'} />:{' '}
                {lyricData()?.register?.name ?? 'N/A'}
                {' · '}
                <Switch fallback={t('lyrics.auto-recognized')}>
                  <Match when={isMapped()}>
                    <Trans key={'lyrics.manually-specified'} />
                  </Match>
                </Switch>
              </div>
            </Marquee>
          </Show>
          <Marquee class={lyricStyles.marquee} gap={32}>
            {lyricData()?.title ?? 'N/A'}
          </Marquee>
          <div class={lyricStyles.resultArtist}>
            {lyricData()?.artist ?? 'N/A'}
          </div>
        </div>
      </Card>
      <div class={lyricStyles.lyricList}>
        <For each={lyricItems()}>
          {({ first: time, second: lyrics }) => (
            <div
              class={cx(
                lyricStyles.lyricLine,
                lyricTime() === time && lyricStyles.lyricLineActive,
              )}
              id={`lyric-${time}`}
            >
              {lyrics.join('\n')}
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default SideBar;
