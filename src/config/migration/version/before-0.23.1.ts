import {
  type Config,
  type LEGACY_Config0_23_1,
} from '../../../../common/schema';
import { type Migrator } from '../types';

export const LEGACY_migrator0_23_1: Migrator = {
  config: (data: unknown) => {
    const configData = (data as LEGACY_Config0_23_1) ?? {};

    return {
      ...configData,
      version: 4,
      experimental: {},
    } satisfies Config;
  },
};
