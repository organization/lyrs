import path from 'node:path';

import { defaultConfigDirectory } from './config';
import { State } from './state';

import { type GameList, GameListSchema } from '../../common/schema';

const gameListPath = path.join(defaultConfigDirectory, 'gameList.json');
export const gameList = new State<GameList>(
  {},
  {
    file: {
      path: gameListPath,
      schema: GameListSchema,
      autoSync: true,
    },
  },
);
gameList.loadFromPath().catch((err: unknown) => console.error(err));
