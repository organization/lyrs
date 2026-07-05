import { Trans } from '@jellybrick/solid-i18next';
import { Box, token } from '@suis-ui/kit';

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
      w={`calc(${token.size['9']} * 4 + ${token.size['4']} + ${token.size['3']})`}
    >
      <Box text="title">
        <Trans key="lyrics.current-playing-track" />
      </Box>
      {/* eslint-disable-next-line solid/style-prop */}
      <LyricProgressBar style="width: 100% !important;" />
      <Box mt="lg" text="title">
        <Trans key="lyrics.current-applied-lyric" />
      </Box>
      <CurrentLyricCard />
      <LyricLineList />
    </Box>
  );
};
