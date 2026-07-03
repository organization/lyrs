import { useTransContext } from '@jellybrick/solid-i18next';
import { createMemo, For, on, onCleanup, onMount, type JSX } from 'solid-js';

import { type LyricMapperMode } from '../../../common/schema';
import { throttle } from '../../../utils/throttle';
import { usePlayingInfo } from '../../components/PlayingInfoProvider';
import { Slider } from '../../components/Slider';
import useLyricMapper from '../../hooks/useLyricMapper';
import { cx } from '../../utils/classNames';

interface MenuSegmentedControlProps<T extends string> {
  items: { key: T; label: JSX.Element }[];
  value: T;
  onSelect: (key: T) => void;
}

const MenuSegmentedControl = <T extends string>(
  props: MenuSegmentedControlProps<T>,
) => {
  return (
    <fieldset class={'flex gap-1'}>
      <For each={props.items}>
        {(item) => (
          <label
            class={cx(
              `
              flex-1 p-1 rounded text-center
              bg-gray-100/60 hover:bg-gray-100/40 active:bg-gray-100/20
              dark:bg-white/5 dark:hover:bg-white/10 dark:active:bg-white/[2.5%]
            `,
              props.value === item.key &&
                `
              !bg-primary-100 dark:!bg-primary-800 hover:!bg-primary-200 hover:dark:!bg-primary-700
            `,
            )}
          >
            <input
              checked={props.value === item.key}
              class={'appearance-none'}
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
    <div
      class={`
      absolute top-0 x-0 flex flex-col gap-4 pt-16 pb-4 px-4
      bg-black/20 border-b border-white/10 backdrop-blur-xl
      z-10
    `}
    >
      <MenuSegmentedControl
        items={[
          { key: 'provider', label: t('lyrics.mode.auto-short') },
          { key: 'player', label: t('lyrics.mode.player-short') },
          { key: 'none', label: t('lyrics.mode.none-short') },
        ]}
        onSelect={onSelectLyricModeType}
        value={lyricModeType()}
      />

      <div class={'flex gap-4 items-center'}>
        <div class={'flex flex-col gap-1'}>
          <Slider
            class={'flex-1'}
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
          />
          <div class={'flex justify-between text-xs text-white/50'}>
            <span>{t('lyrics.delay.slowly')}</span>
            <span>{t('lyrics.delay.default')}</span>
            <span>{t('lyrics.delay.fastly')}</span>
          </div>
        </div>
        <div class={'flex pb-2'}>
          <label class={'input-group group'}>
            <input
              class={'input w-[10ch]'}
              onChange={(e) => onUpdateDelay(e.currentTarget.valueAsNumber)}
              type={'number'}
              value={lyricMapperItem()?.delay ?? 0}
            />
            <div class={'suffix group-focus-within:suffix-focus-within'}>
              ms
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
