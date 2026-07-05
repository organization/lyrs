import { useTransContext } from '@jellybrick/solid-i18next';
import { Box } from '@suis-ui/kit';
import { createEffect, For, onCleanup, Show } from 'solid-js';

import { Empty } from '../../../components/empty';
import { ScrollArea } from '../../../components/scroll-area';
import Spinner from '../../../components/spinner';
import { type LyricsSearchState } from '../../hooks/useLyricsSearch';
import { SearchResultItem } from '../search-result-item';

type SearchPanelProps = {
  search: LyricsSearchState;
};

export const SearchPanel = (props: SearchPanelProps) => {
  const [t] = useTransContext();
  let observer: IntersectionObserver | null = null;

  const observeNextPage = (element: HTMLDivElement) => {
    observer?.disconnect();
    observer = new IntersectionObserver((entries) => {
      if (!props.search.loading() && entries[0]?.intersectionRatio > 0) {
        props.search.search(true);
      }
    });
    observer.observe(element);
  };

  createEffect(() => {
    if (!props.search.hasNext()) observer?.disconnect();
  });

  onCleanup(() => {
    observer?.disconnect();
  });

  return (
    <ScrollArea
      align="stretch"
      direction="column"
      fadeAxes="y"
      flex={1}
      gap="xs"
      minH="0"
      overflow={'auto'}
      p={'md'}
      w="100%"
    >
      <Show when={props.search.loading()}>
        <Box align="center" justify="center" p="md" w="100%">
          <Spinner />
        </Box>
      </Show>
      <Show
        when={!props.search.loading() && props.search.searchList().length === 0}
      >
        <Empty
          description={t('lyrics.lyric-search-not-found-description')}
          title={t('lyrics.lyric-search-not-found')}
        />
      </Show>
      <For each={props.search.searchList()}>
        {(item) => (
          <SearchResultItem
            item={item}
            onSelect={props.search.select}
            selected={props.search.currentLyricId() === item.id}
          />
        )}
      </For>
      <Show when={props.search.hasNext()}>
        <Box align="center" justify="center" p="md" ref={observeNextPage}>
          <Spinner />
        </Box>
      </Show>
    </ScrollArea>
  );
};
