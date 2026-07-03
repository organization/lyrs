import { DEFAULT_CONFIG } from '../../../../common/constants';
import {
  type LEGACY_LyricMapper0_18_0,
  type LyricMapper,
  type LyricMapperMode,
} from '../../../../common/schema';
import { type Migrator } from '../types';

export const LEGACY_migrator0_18_0: Migrator = {
  lyricMapper: (data: unknown) => {
    const lyricMapperData = data as LEGACY_LyricMapper0_18_0;

    return Object.entries(lyricMapperData).reduce(
      (prev, [key, value]) => ({
        ...prev,
        [key]: {
          mode: {
            type: 'provider' as const,
            id: value?.toString(),
            provider: DEFAULT_CONFIG.lyricProvider,
          } satisfies LyricMapperMode,
        },
      }),
      {},
    ) satisfies LyricMapper;
  },
};
