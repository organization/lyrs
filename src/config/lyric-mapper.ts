import path from 'node:path';

import { defaultConfigDirectory } from './config';
import { State } from './state';

import { type LyricMapper, LyricMapperSchema } from '../../common/schema';

const lyricPath = path.join(defaultConfigDirectory, 'lyrics.json');
export const lyricMapper = new State<LyricMapper>(
  {},
  {
    file: {
      path: lyricPath,
      schema: LyricMapperSchema,
      autoSync: true,
    },
  },
);
