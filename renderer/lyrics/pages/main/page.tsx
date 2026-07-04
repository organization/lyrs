import { Box } from '@suis-ui/kit';

import Layout from '../../../components/Layout';
import PlayingInfoProvider from '../../../components/PlayingInfoProvider';
import usePluginsCSS from '../../../hooks/usePluginsCSS';
import { SearchToolbar } from '../../components/search-toolbar';
import { SearchPanel } from '../../components/search-panel';
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
        <Box
          align="center"
          overflow="hidden"
          flex={1}
        >
          <SearchToolbar search={search} />
          <SearchPanel search={search} />
        </Box>
      </Box>
    </Layout>
  );
};
