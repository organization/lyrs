import { useTransContext } from '@jellybrick/solid-i18next';
import { Box, Button, Input } from '@suis-ui/kit';
import { Marquee } from '@suyongs/solid-utility';
import { Check, ChevronRight, Search, UserRoundSearch } from 'lucide-solid';
import {
  createEffect,
  createSignal,
  For,
  type JSX,
  on,
  Show,
  startTransition,
} from 'solid-js';

import { type LyricMetadata } from '../../../common/provider';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { usePlayingInfo } from '../../components/PlayingInfoProvider';
import Spinner from '../../components/Spinner';
import useLyricMapper from '../../hooks/useLyricMapper';
import { useLyricProvider } from '../../hooks/useLyricProvider';
import usePluginOverride from '../../hooks/usePluginOverride';
import { cx } from '../../utils/classNames';
import * as trayStyles from '../tray.css';

export const SearchContainer = () => {
  const {
    lyricData,
    title: playingTitle,
    artist: playingArtist,
    duration,
    status,
    id,
  } = usePlayingInfo();
  const [, setLyricMapper] = useLyricMapper();
  const [t] = useTransContext();
  const provider = useLyricProvider();

  const [open, setOpen] = createSignal(false);
  const [title, setTitle] = createSignal(playingTitle());
  const [artist, setArtist] = createSignal(playingArtist());

  const [searchList, setSearchList] = createSignal<LyricMetadata[]>([]);
  const [loading, setLoading] = createSignal(false);
  const currentLyricID = () => lyricData()?.id;

  createEffect(
    on([playingTitle, playingArtist, status], async () => {
      if (status() !== 'idle' && status() !== 'paused') {
        setTitle(playingTitle().trim());
        setArtist(playingArtist().trim());
        await startTransition(async () => await onSearch());
      }
    }),
  );

  const onSearch = async () => {
    setLoading(true);

    const lyricProvider = provider();
    await usePluginOverride(
      'search-lyrics',
      async (_, artist, title, __, options) => {
        const result = await lyricProvider
          .searchLyrics({
            artist,
            title,
            playtime: options?.playtime,
          })
          .catch(() => []);

        setSearchList(result);
      },
      'default',
      artist(),
      title(),
      '',
      { playtime: duration() },
    );

    setLoading(false);
  };
  const onSelect = async (metadata: LyricMetadata) => {
    const newMapper = {
      [id()]: {
        mode: {
          type: 'provider' as const,
          id: metadata.id,
        },
      },
    };

    await setLyricMapper(newMapper);
    setLoading(false);
  };
  const onArtist: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (
    event,
  ) => {
    event.preventDefault();

    setOpen(true);
  };
  const onArtistChange = () => {
    setArtist(artist().trim());
    setOpen(false);
    onSearch();
  };

  return (
    <div class={trayStyles.searchRoot}>
      <form
        class={trayStyles.searchForm}
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
      >
        <Input
          flex={1}
          onInput={(event) => setTitle(event.target.value)}
          placeholder={t('lyrics.title')}
          value={title()}
          w="2rem"
        />
        <Button type={'icon'} variant="ghost">
          <Search size={16} />
        </Button>
        <Button onClick={onArtist} type={'icon'} variant="ghost">
          <UserRoundSearch size={16} />
        </Button>
      </form>
      <div class={trayStyles.searchResults}>
        <Show when={loading()}>
          <div class={trayStyles.searchLoading}>
            <Spinner />
          </div>
        </Show>
        <For each={searchList()}>
          {(item) => (
            <Card
              class={cx(
                currentLyricID() === item.id &&
                  trayStyles.resultCardSelected,
              )}
              onClick={() => onSelect(item)}
            >
              <div class={trayStyles.resultContent}>
                <div class={trayStyles.resultMeta}>
                  ID: {item.id}
                </div>
                <Marquee gap={16}>
                  {item.title}
                </Marquee>
                <div class={trayStyles.resultArtist}>{item.artist}</div>
              </div>
                <Show
                  fallback={
                    <Check class={trayStyles.resultIconMedium} />
                  }
                  when={currentLyricID() !== item.id}
                >
                  <ChevronRight class={trayStyles.resultIconSmall} />
                </Show>
            </Card>
          )}
        </For>
      </div>
      <Modal
        buttons={[
          {
            type: 'positive',
            name: t('common.okay'),
            onClick: onArtistChange,
          },
        ]}
        onClose={() => setOpen(false)}
        open={open()}
      >
        <Box mb="sm" text="title">
          {t('lyrics.artist')}
        </Box>
        <Input
          onInput={(event) => setArtist(event.target.value)}
          value={artist()}
        />
      </Modal>
    </div>
  );
};
