import { Trans, useTransContext } from '@jellybrick/solid-i18next';
import { Box, Select } from '@suis-ui/kit';
import { Marquee } from '@suyongs/solid-utility';
import { Match, Show, Switch } from 'solid-js';

import { type LyricMapperMode } from '../../../../common/schema';
import { getLyricMapperId } from '../../../../common/utils';
import Card from '../../../components/card';
import {
  type LyricMode,
  usePlayingInfo,
} from '../../../components/playing-info-provider';
import useLyricMapper from '../../../hooks/useLyricMapper';
import { LyricDelayEditor } from '../lyric-delay-editor';

const LYRIC_MODE_OPTIONS: LyricMode[] = ['auto', 'player', 'none'];

export const CurrentLyricCard = () => {
  const { coverUrl, isMapped, lyricData, lyricMode, title } = usePlayingInfo();
  const [lyricMapper, setLyricMapper] = useLyricMapper();
  const [t] = useTransContext();
  const lyricModeData = () =>
    LYRIC_MODE_OPTIONS.map((mode) => ({
      label: t(`lyrics.mode.${mode}`),
      value: mode,
    }));

  const mapperId = () => getLyricMapperId(title() ?? '', coverUrl());
  const lyricMapperItem = () => lyricMapper()[mapperId()];

  const setDelay = (delay: number) => {
    setLyricMapper({
      [mapperId()]: {
        delay,
      },
    });
  };

  const onChangeLyricMode = (mode: LyricMode) => {
    let newMode: LyricMapperMode | null = null;
    if (mode === 'player') newMode = { type: 'player' };
    if (mode === 'none') newMode = { type: 'none' };

    setLyricMapper({
      [mapperId()]: {
        mode: newMode,
      },
    });
  };

  return (
    <Card
      subCards={[
        <Box
          align="center"
          direction="row"
          gap="md"
          justify="space-between"
          w="100%"
        >
          <Trans key="lyrics.mode" />
          <Select
            data={lyricModeData()}
            onChange={(selected) => {
              if (!selected) return;
              onChangeLyricMode(selected.value as LyricMode);
            }}
            value={lyricMode() ?? 'auto'}
          />
        </Box>,
        <LyricDelayEditor
          onChange={setDelay}
          value={() => lyricMapperItem()?.delay ?? 0}
        />,
      ]}
    >
      <Box
        align="flex-start"
        direction="column"
        flex={1}
        justify="center"
        minW="0"
      >
        <Show when={lyricData()}>
          <Marquee gap={32} style={{ width: '100%' }}>
            <Box c="text.caption" text="caption">
              <Trans key="lyrics.lyric-id" />: {lyricData()?.id ?? 'N/A'}
              {' · '}
              <Trans key="lyrics.lyric-author" />:{' '}
              {lyricData()?.register?.name ?? 'N/A'}
              {' · '}
              <Switch fallback={t('lyrics.auto-recognized')}>
                <Match when={isMapped()}>
                  <Trans key="lyrics.manually-specified" />
                </Match>
              </Switch>
            </Box>
          </Marquee>
        </Show>
        <Marquee gap={32} style={{ width: '100%' }}>
          {lyricData()?.title ?? 'N/A'}
        </Marquee>
        <Box text="caption">{lyricData()?.artist ?? 'N/A'}</Box>
      </Box>
    </Card>
  );
};
