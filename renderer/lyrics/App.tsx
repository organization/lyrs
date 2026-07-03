import {
  Trans,
  TransProvider,
  useTransContext,
} from '@jellybrick/solid-i18next';
import { Button, Input } from '@suis-ui/kit';
import { Marquee } from '@suyongs/solid-utility';
import { Check, ChevronRight, Search } from 'lucide-solid';
import {
  createEffect,
  createSignal,
  For,
  Match,
  on,
  onCleanup,
  Show,
  startTransition,
  Switch,
} from 'solid-js';

import * as lyricStyles from './lyrics.css';
import SideBar from './SideBar';

import { LangResource } from '../../common/intl';
import { type LyricMetadata } from '../../common/provider';
import Card from '../components/Card';
import Layout from '../components/Layout';
import PlayingInfoProvider, {
  usePlayingInfo,
} from '../components/PlayingInfoProvider';
import Selector from '../components/Select';
import Spinner from '../components/Spinner';
import UserCSS from '../components/UserCSS';
import useConfig from '../hooks/useConfig';
import useLyricMapper from '../hooks/useLyricMapper';
import { useLyricProvider } from '../hooks/useLyricProvider';
import usePluginOverride from '../hooks/usePluginOverride';
import usePluginsCSS from '../hooks/usePluginsCSS';
import { cx } from '../utils/classNames';
import { formatTime } from '../utils/formatTime';

const LyricsMapEditor = () => {
  usePluginsCSS();

  const lyricProvider = useLyricProvider();
  const {
    lyricData,
    id: playingId,
    title: playingTitle,
    artist: playingArtist,
    duration,
    status,
  } = usePlayingInfo();

  const [searchMode, setSearchMode] = createSignal<'default' | 'id'>('default');

  const [title, setTitle] = createSignal(playingTitle());
  const [artist, setArtist] = createSignal(playingArtist());
  const [id, setId] = createSignal('');

  const [loading, setLoading] = createSignal(false);
  const [searchList, setSearchList] = createSignal<LyricMetadata[]>([]);
  const [page, setPage] = createSignal(0);
  const [hasNext, setHasNext] = createSignal(false);
  const [, setLyricMapper] = useLyricMapper();
  const [t] = useTransContext();

  createEffect(
    on([playingTitle, playingArtist, status], async () => {
      if (status() !== 'idle' && status() !== 'paused') {
        setTitle(playingTitle().trim());
        setArtist(playingArtist().trim());
        await startTransition(async () => await onSearch());
      }
    }),
  );

  onCleanup(() => {
    observer.disconnect();
  });

  const onSearch = async (nextPage = false) => {
    setLoading(true);

    if (!nextPage) {
      setPage(0);
    }

    await usePluginOverride(
      'search-lyrics',
      async (mode, artist, title, id, options) => {
        const list: LyricMetadata[] = [];

        if (mode === 'default') {
          list.push(
            ...(await lyricProvider()
              .searchLyrics({
                artist,
                title,
                playtime: options?.playtime,
                page: options?.page,
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

        if (nextPage) {
          const isDuplicated = searchList().at(-1)?.id === list.at(-1)?.id;

          if (!isDuplicated) {
            setPage(page() + 1);
            setSearchList([...searchList(), ...list]);
          } else {
            setHasNext(false);
          }
        } else {
          setPage(0);
          setSearchList(list);
          setHasNext(true);
        }
      },
      searchMode(),
      artist(),
      title(),
      id(),
      { playtime: duration(), page: page() },
    );

    setLoading(false);
  };

  const onSelect = async (metadata: LyricMetadata) => {
    const newMapper = {
      [playingId()]: {
        mode: {
          type: 'provider' as const,
          id: metadata.id,
        },
      },
    };

    await setLyricMapper(newMapper);
    setLoading(false);
  };

  const observer = new IntersectionObserver((entries) => {
    if (!loading() && entries[0].intersectionRatio > 0) {
      onSearch(true);
    }
  });

  return (
    <Layout>
      <div class={lyricStyles.root}>
        <PlayingInfoProvider>
          <SideBar />
        </PlayingInfoProvider>
        <div class={lyricStyles.content}>
          <form
            class={lyricStyles.searchForm}
            onSubmit={(event) => {
              event.preventDefault();
              onSearch();
            }}
          >
            <Selector
              format={(str) => t(`lyrics.search-mode.${str}`)} minWidth="90px"
              mode={'select'}
              onChange={setSearchMode}
              options={['default', 'id'] as const}
              placeholder={t('lyrics.search-mode')}
              value={searchMode()}
              width="20%"
            />
            <Switch>
              <Match when={searchMode() === 'default'}>
                <>
                  <Input
                    flex="1 1 20%"
                    onInput={(event) => setArtist(event.target.value)}
                    placeholder={t('lyrics.artist')}
                    value={artist()}
                    w="4rem"
                  />
                  <Input
                    flex="1 1 20%"
                    onInput={(event) => setTitle(event.target.value)}
                    placeholder={t('lyrics.title')}
                    value={title()}
                    w="4rem"
                  />
                </>
              </Match>
              <Match when={searchMode() === 'id'}>
                <>
                  <Input
                    flex="1 1 20%"
                    onInput={(event) => setId(event.target.value)}
                    placeholder={t('lyrics.id')}
                    value={id()}
                    w="4rem"
                  />
                </>
              </Match>
            </Switch>
            <Button type="icon" variant="ghost">
              <Search size={16} />
            </Button>
          </form>
          <div class={lyricStyles.results}>
            <Show when={loading()}>
              <Spinner />
            </Show>
            <Show when={!loading() && searchList().length === 0}>
              <div class={lyricStyles.empty}>
                <Trans key={'lyrics.lyric-search-not-found'} />
              </div>
            </Show>
            <For each={searchList()}>
              {(item) => (
                <Card
                  class={cx(
                    lyricData()?.id === item.id && lyricStyles.selectedCard,
                  )}
                  onClick={() => onSelect(item)}
                >
                  <div class={lyricStyles.resultContent}>
                    <div class={lyricStyles.resultMeta}>
                      ID: {item.id}
                    </div>
                    <Marquee class={lyricStyles.marquee} gap={16}>
                      {item.title}
                    </Marquee>
                    <div class={lyricStyles.resultArtist}>{item.artist}</div>
                  </div>
                  <div class={lyricStyles.resultSideMeta}>
                    <div class={lyricStyles.resultDate}>
                      {item.registerDate
                        ? new Date(item.registerDate).toLocaleString(
                            undefined,
                            {
                              timeZone: 'Asia/Seoul',
                              hour12: false,
                              dateStyle: 'medium',
                              timeStyle: 'medium',
                            },
                          )
                        : 'No Date'}
                    </div>
                    <Show when={(item.playtime ?? 0) > 0}>
                      <div class={lyricStyles.resultDate}>
                        <Trans key={'lyrics.playtime'} />:{' '}
                        {formatTime(item.playtime ?? 0)}
                      </div>
                    </Show>
                  </div>
                  <Show
                    fallback={
                      <Check class={lyricStyles.resultCheckIcon} />
                    }
                    when={lyricData()?.id !== item.id}
                  >
                    <ChevronRight class={lyricStyles.resultIcon} />
                  </Show>
                </Card>
              )}
            </For>
            <Show when={hasNext()}>
              <Spinner
                ref={(element) => {
                  observer.observe(element);
                }}
              />
            </Show>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const [config] = useConfig();

const App = () => (
  <TransProvider options={{ resources: LangResource, lng: config()?.language }}>
    <PlayingInfoProvider>
      <LyricsMapEditor />
      <UserCSS />
    </PlayingInfoProvider>
  </TransProvider>
);

export default App;
