import { createMemo } from 'solid-js';
import { Entry } from 'tstl';

import { usePlayingInfo } from '../../components/playing-info-provider';

export const useCurrentLyricItems = () => {
  const { lyricMode, lyrics, playerLyrics } = usePlayingInfo();

  const lyricItems = createMemo(() => {
    if (lyricMode() === 'player') {
      return Object.entries(playerLyrics() ?? {}).map(
        ([time, lyrics]) => new Entry(~~time, lyrics),
      );
    }

    return lyrics()?.toJSON() ?? [];
  });

  return lyricItems;
};
