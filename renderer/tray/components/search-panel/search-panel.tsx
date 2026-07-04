import { useTransContext } from '@jellybrick/solid-i18next';
import { Box, Button, Input, Item, Tooltip } from '@suis-ui/kit';
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

import { type LyricMetadata } from '../../../../common/provider';
import Modal from '../../../components/Modal';
import { usePlayingInfo } from '../../../components/PlayingInfoProvider';
import Spinner from '../../../components/Spinner';
import useLyricMapper from '../../../hooks/useLyricMapper';
import { useLyricProvider } from '../../../hooks/useLyricProvider';
import usePluginOverride from '../../../hooks/usePluginOverride';
import { ArtistButton } from '../artist-button';

export const SearchPanel = () => {
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

  const [title, setTitle] = createSignal(playingTitle());
  const [artist, setArtist] = createSignal(playingArtist());

  const [searchList, setSearchList] = createSignal<LyricMetadata[]>([]);
  const [loading, setLoading] = createSignal(false);
  const currentLyricID = () => lyricData()?.id;

  createEffect(
    on([playingTitle, playingArtist, status], async () => {
      if (status() !== 'idle' && status() !== 'paused') {
        setTitle(playingTitle()?.trim() ?? '');
        setArtist(playingArtist()?.trim() ?? '');
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
      artist() ?? '',
      title() ?? '',
      '',
      { playtime: duration() },
    );

    setLoading(false);
  };
  const onSelect = async (metadata: LyricMetadata) => {
    const key = id();
    if (!key) return;

    const newMapper = {
      [key]: {
        mode: {
          type: 'provider' as const,
          id: metadata.id,
        },
      },
    };

    await setLyricMapper(newMapper);
    setLoading(false);
  };
  const onArtistChange = (newArtist: string) => {
    setArtist(newArtist);
    onSearch();
  };
  const onSubmit: JSX.EventHandlerUnion<HTMLFormElement, SubmitEvent> = (
    event,
  ) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <Box w="100%" align="stretch" direction="column" flex={1} minH="0">
      <Box
        align="center"
        as="form"
        direction="row"
        gap="sm"
        justify="flex-start"
        onSubmit={onSubmit}
        px={'md'}
      >
        <Input
          flex={1}
          onInput={(event) => setTitle(event.target.value)}
          placeholder={t('lyrics.title')}
          value={title() ?? ''}
          style={{ 'min-width': '0' }}
        />
        <Button type={'icon'} variant="ghost" size={'sm'} r={'sm'}>
          <Search size={16} />
        </Button>
        <ArtistButton artist={artist() ?? ''} onChange={onArtistChange} />
      </Box>
      <Box
        align="stretch"
        direction="column"
        flex={1}
        minH="0"
        overflow="auto"
        w="100%"
        p={'md'}
        gap={'sm'}
      >
        <Show when={loading()}>
          <Box align="center" h="100%" justify="center" p="lg" w="100%">
            <Spinner />
          </Box>
        </Show>
        <For each={searchList()}>
          {(item) => (
            <Tooltip
              content={`ID: ${item.id} · Album: ${item.album}`}
              shadow={'lg'}
            >
              <Item
                as={Button}
                variant={'secondary'}
                title={item.title}
                description={item.artist}
                onClick={() => onSelect(item)}
                action={
                  currentLyricID() === item.id ? (
                    <Check width={'1.6rem'} height={'1.6rem'} />
                  ) : (
                    <ChevronRight width={'1.6rem'} height={'1.6rem'} />
                  )
                }
                active={currentLyricID() === item.id}
              />
            </Tooltip>
          )}
        </For>
      </Box>
    </Box>
  );
};
