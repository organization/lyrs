import { Trans } from '@jellybrick/solid-i18next';
import { Box } from '@suis-ui/kit';

import LyricProgressBar from '../../../main/components/LyricProgressBar';
import { CurrentLyricCard } from '../current-lyric-card';
import { LyricLineList } from '../lyric-line-list';

export const Sidebar = () => {
  return (
    <Box
      align="stretch"
      direction="column"
      gap="sm"
      h="100%"
      minH="0"
      overflow="hidden"
      p="lg"
      style={{ 'flex-shrink': 0 }}
      w="312px"
    >
      <Box style={{ 'font-size': '20px', 'line-height': '1.3' }}>
        <Trans key="lyrics.current-playing-track" />
      </Box>
      {/* eslint-disable-next-line solid/style-prop */}
      <LyricProgressBar style="width: 280px !important;" />
      <Box mt="lg" style={{ 'font-size': '20px', 'line-height': '1.3' }}>
        <Trans key="lyrics.current-applied-lyric" />
      </Box>
      <CurrentLyricCard />
      <LyricLineList />
    </Box>
  );
};
