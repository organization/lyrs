import { useTransContext } from '@jellybrick/solid-i18next';
import { Box, Button, Input, Item, token, Tooltip } from '@suis-ui/kit';
import { Check, ChevronRight, Search } from 'lucide-solid';
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
import { usePlayingInfo } from '../../../components/playing-info-provider';
import { ScrollArea } from '../../../components/scroll-area';
import Spinner from '../../../components/spinner';
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
    <Box align="stretch" direction="column" flex={1} minH="0" w="100%">
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
          style={{ 'min-width': '0' }}
          value={title() ?? ''}
        />
        <Button r={'sm'} size={'sm'} type={'icon'} variant="ghost">
          <Search size={token.size['1']} />
        </Button>
        <ArtistButton artist={artist() ?? ''} onChange={onArtistChange} />
      </Box>
      <ScrollArea
        align="stretch"
        direction="column"
        fadeAxes="y"
        flex={1}
        gap={'sm'}
        minH="0"
        overflow="auto"
        p={'md'}
        w="100%"
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
                action={
                  currentLyricID() === item.id ? (
                    <Check height={token.size['1']} width={token.size['1']} />
                  ) : (
                    <ChevronRight
                      height={token.size['1']}
                      width={token.size['1']}
                    />
                  )
                }
                active={currentLyricID() === item.id}
                as={Button}
                description={item.artist}
                onClick={() => onSelect(item)}
                title={item.title}
                variant={'secondary'}
              />
            </Tooltip>
          )}
        </For>
      </ScrollArea>
    </Box>
  );
};
