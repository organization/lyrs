import { useTransContext } from '@jellybrick/solid-i18next';
import { Box, Button, Input, Select } from '@suis-ui/kit';
import { Search } from 'lucide-solid';
import { Match, Switch } from 'solid-js';

import {
  type LyricsSearchMode,
  type LyricsSearchState,
} from '../../hooks/useLyricsSearch';

import type { JSX } from 'solid-js/jsx-runtime';

type SearchToolbarProps = {
  search: LyricsSearchState;
};

const SEARCH_MODE_OPTIONS: LyricsSearchMode[] = ['default', 'id'];

export const SearchToolbar = (props: SearchToolbarProps) => {
  const [t] = useTransContext();
  const searchModeData = () =>
    SEARCH_MODE_OPTIONS.map((mode) => ({
      label: t(`lyrics.search-mode.${mode}`),
      value: mode,
    }));
  const onSubmit: JSX.EventHandlerUnion<HTMLFormElement, SubmitEvent> = (
    event,
  ) => {
    event.preventDefault();
    props.search.search();
  };

  return (
    <Box
      pos={'sticky'}
      top={'0'}
      as="form"
      w="100%"
      direction="row"
      align="center"
      gap="sm"
      p={'sm'}
      onSubmit={onSubmit}
    >
      <Select
        data={searchModeData()}
        onChange={(selected) => {
          if (!selected) return;
          props.search.setSearchMode(selected.value as LyricsSearchMode);
        }}
        placeholder={t('lyrics.search-mode')}
        value={props.search.searchMode()}
      />
      <Switch>
        <Match when={props.search.searchMode() === 'default'}>
          <Input
            flex="1 1 0"
            onInput={(event) => props.search.setArtist(event.target.value)}
            placeholder={t('lyrics.artist')}
            value={props.search.artist()}
          />
          <Input
            flex="1 1 0"
            onInput={(event) => props.search.setTitle(event.target.value)}
            placeholder={t('lyrics.title')}
            value={props.search.title()}
          />
        </Match>
        <Match when={props.search.searchMode() === 'id'}>
          <Input
            flex="1 1 0"
            onInput={(event) => props.search.setId(event.target.value)}
            placeholder={t('lyrics.id')}
            value={props.search.id()}
          />
        </Match>
      </Switch>
      <Button r="md" size="sm" type="icon" variant="ghost">
        <Search size={16} />
      </Button>
    </Box>
  );
};
