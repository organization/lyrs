import { Box } from '@suis-ui/kit';
import { createEffect, For } from 'solid-js';

import { ScrollArea } from '../../../components/scroll-area';
import useLyric from '../../../hooks/useLyric';
import { useCurrentLyricItems } from '../../hooks/useCurrentLyricItems';

export const LyricLineList = () => {
  const lyricItems = useCurrentLyricItems();
  const [, lyricTime] = useLyric();

  createEffect(() => {
    const time = lyricTime();

    document.querySelector(`#lyric-${time ?? '0'}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });

  return (
    <ScrollArea
      fadeAxes="y"
      flex={1}
      minH="0"
      overflow="auto"
      style={{
        'overflow-x': 'visible',
        'text-align': 'center',
        'will-change': 'scroll-position',
      }}
    >
      <For each={lyricItems()}>
        {({ first: time, second: lyrics }) => (
          <Box
            c={lyricTime() === time ? 'primary.main' : undefined}
            id={`lyric-${time}`}
            my="lg"
            style={{ 'white-space': 'pre-line' }}
          >
            {lyrics.join('\n')}
          </Box>
        )}
      </For>
    </ScrollArea>
  );
};
