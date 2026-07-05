import { Box } from '@suis-ui/kit';

import Layout from '../../../components/layout';
import PlayingInfoProvider from '../../../components/playing-info-provider';
import usePluginsCSS from '../../../hooks/usePluginsCSS';
import { SearchPanel } from '../../components/search-panel';
import { SearchToolbar } from '../../components/search-toolbar';
import { Sidebar } from '../../components/sidebar';
import { useLyricsSearch } from '../../hooks/useLyricsSearch';

export const MainPage = () => {
  usePluginsCSS();

  const search = useLyricsSearch();

  return (
    <Layout>
      <Box
        align="stretch"
        c="text.main"
        direction="row"
        h="100%"
        minH="0"
        w="100%"
      >
        <PlayingInfoProvider>
          <Sidebar />
        </PlayingInfoProvider>
        <Box align="center" flex={1} overflow="hidden">
          <SearchToolbar search={search} />
          <SearchPanel search={search} />
        </Box>
      </Box>
    </Layout>
  );
};
