import { createEffect, createSignal, on } from 'solid-js';

import { type LyricMetadata } from '../../../common/provider';
import { usePlayingInfo } from '../../components/playing-info-provider';
import useLyricMapper from '../../hooks/useLyricMapper';
import { useLyricProvider } from '../../hooks/useLyricProvider';
import usePluginOverride from '../../hooks/usePluginOverride';

export type LyricsSearchMode = 'default' | 'id';

const FIRST_PAGE = 0;

export const useLyricsSearch = () => {
  const lyricProvider = useLyricProvider();
  const {
    artist: playingArtist,
    duration,
    id: playingId,
    lyricData,
    status,
    title: playingTitle,
  } = usePlayingInfo();
  const [, setLyricMapper] = useLyricMapper();

  const [searchMode, setSearchMode] = createSignal<LyricsSearchMode>('default');
  const [title, setTitle] = createSignal(playingTitle() ?? '');
  const [artist, setArtist] = createSignal(playingArtist() ?? '');
  const [id, setId] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [searchList, setSearchList] = createSignal<LyricMetadata[]>([]);
  const [page, setPage] = createSignal(FIRST_PAGE);
  const [hasNext, setHasNext] = createSignal(false);

  const searchProvider = async (
    mode: LyricsSearchMode,
    artist: string,
    title: string,
    id: string,
    options?: { page?: number; playtime?: number },
  ) => {
    const list: LyricMetadata[] = [];

    if (mode === 'default') {
      list.push(
        ...(await lyricProvider()
          .searchLyrics({
            artist,
            page: options?.page,
            playtime: options?.playtime,
            title,
          })
          .catch((e) => {
            console.error(e);
            return [];
          })),
      );
    }
    if (mode === 'id') {
      const result = await lyricProvider()
        .getLyricById(id)
        .catch((e) => {
          console.error(e);
          return null;
        });

      if (result) list.push(result);
    }

    return list;
  };

  const getSearchResult = async (targetPage: number) => {
    let handled = false;
    let result: LyricMetadata[] = [];

    await usePluginOverride(
      'search-lyrics',
      async (mode, artist, title, id, options) => {
        handled = true;
        result = await searchProvider(mode, artist, title, id, options);
      },
      searchMode(),
      artist(),
      title(),
      id(),
      { page: targetPage, playtime: duration() },
    );

    return handled ? result : null;
  };

  const search = async (nextPage = false) => {
    const targetPage = nextPage ? page() + 1 : FIRST_PAGE;

    setLoading(true);

    try {
      const list = await getSearchResult(targetPage);
      if (!list) return;

      if (nextPage) {
        const isDuplicated =
          list.length === 0 || searchList().at(-1)?.id === list.at(-1)?.id;

        if (isDuplicated) {
          setHasNext(false);
          return;
        }

        setPage(targetPage);
        setSearchList((current) => [...current, ...list]);
        setHasNext(searchMode() === 'default');
        return;
      }

      setPage(FIRST_PAGE);
      setSearchList(list);
      setHasNext(searchMode() === 'default' && list.length > 0);
    } finally {
      setLoading(false);
    }
  };

  const select = async (metadata: LyricMetadata) => {
    const key = playingId();
    if (!key) return;

    await setLyricMapper({
      [key]: {
        mode: {
          id: metadata.id,
          type: 'provider' as const,
        },
      },
    });
    setLoading(false);
  };

  createEffect(
    on([playingTitle, playingArtist, status], () => {
      if (status() !== 'idle' && status() !== 'paused') {
        setTitle(playingTitle()?.trim() ?? '');
        setArtist(playingArtist()?.trim() ?? '');
        search();
      }
    }),
  );

  return {
    artist,
    currentLyricId: () => lyricData()?.id,
    hasNext,
    id,
    loading,
    search,
    searchList,
    searchMode,
    select,
    setArtist,
    setId,
    setSearchMode,
    setTitle,
    title,
  };
};

export type LyricsSearchState = ReturnType<typeof useLyricsSearch>;
