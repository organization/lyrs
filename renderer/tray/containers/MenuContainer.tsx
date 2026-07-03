import { useTransContext } from '@jellybrick/solid-i18next';
import { Box, Input } from '@suis-ui/kit';
import { createMemo, For, on, onCleanup, onMount, type JSX } from 'solid-js';

import { type LyricMapperMode } from '../../../common/schema';
import { throttle } from '../../../utils/throttle';
import { usePlayingInfo } from '../../components/PlayingInfoProvider';
import { Slider } from '../../components/Slider';
import useLyricMapper from '../../hooks/useLyricMapper';
import { cx } from '../../utils/classNames';
import * as trayStyles from '../tray.css';

interface MenuSegmentedControlProps<T extends string> {
  items: { key: T; label: JSX.Element }[];
  value: T;
  onSelect: (key: T) => void;
}

const MenuSegmentedControl = <T extends string>(
  props: MenuSegmentedControlProps<T>,
) => {
  return (
    <fieldset class={trayStyles.segmentGroup}>
      <For each={props.items}>
        {(item) => (
          <label
            class={cx(
              trayStyles.segmentItem,
              props.value === item.key && trayStyles.segmentItemSelected,
            )}
          >
            <input
              checked={props.value === item.key}
              class={trayStyles.segmentInput}
              onChange={(e) => props.onSelect(e.currentTarget.value as T)}
              type="radio"
              value={item.key}
            />
            {item.label}
          </label>
        )}
      </For>
    </fieldset>
  );
};

interface MenuContainerProps {
  onClose: () => void;
}

export const MenuContainer = (props: MenuContainerProps) => {
  const { id, lyricMode } = usePlayingInfo();
  const [t] = useTransContext();
  const [lyricMapper, setLyricMapper] = useLyricMapper();
  const lyricMapperItem = () => lyricMapper()[id()];

  const lyricModeType = createMemo(
    on(lyricMode, (mode) =>
      mode === 'auto' || mode === 'manual' ? ('provider' as const) : mode,
    ),
  );

  const onSelectLyricModeType = (nextType: LyricMapperMode['type']) => {
    if (lyricModeType() === nextType) {
      return;
    }

    setLyricMapper({
      [id()]: {
        mode: { type: nextType },
      },
    });
  };

  const onUpdateDelay = throttle((nextDelay: number) => {
    if (!Number.isFinite(nextDelay)) {
      return;
    }

    setLyricMapper({
      [id()]: {
        delay: ~~nextDelay,
      },
    });
  }, 300);

  onMount(() => {
    const onPageBlur = () => props.onClose();
    window.addEventListener('blur', onPageBlur);
    onCleanup(() => window.removeEventListener('blur', onPageBlur));
  });

  return (
    <div class={trayStyles.menuPanel}>
      <MenuSegmentedControl
        items={[
          { key: 'provider', label: t('lyrics.mode.auto-short') },
          { key: 'player', label: t('lyrics.mode.player-short') },
          { key: 'none', label: t('lyrics.mode.none-short') },
        ]}
        onSelect={onSelectLyricModeType}
        value={lyricModeType()}
      />

      <div class={trayStyles.delayPanel}>
        <div class={trayStyles.delaySliderGroup}>
          <Slider
            max={3000}
            min={-3000}
            onChange={(value) => {
              setLyricMapper({
                [id()]: {
                  delay: value,
                },
              });
            }}
            step={100}
            value={lyricMapperItem()?.delay ?? 0}
            width="100%"
          />
          <div class={trayStyles.delayLabels}>
            <span>{t('lyrics.delay.slowly')}</span>
            <span>{t('lyrics.delay.default')}</span>
            <span>{t('lyrics.delay.fastly')}</span>
          </div>
        </div>
        <Box align="center" direction="row" gap="xs" pb="sm">
          <Input
            onChange={(e) => onUpdateDelay(e.currentTarget.valueAsNumber)}
            type={'number'}
            value={lyricMapperItem()?.delay ?? 0}
            w="10ch"
          />
          <Box text="caption">ms</Box>
        </Box>
      </div>
    </div>
  );
};
