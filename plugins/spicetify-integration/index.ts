import manifest from './manifest.json';
import runner from './script';

export const SpiceifyIntegrationPlugin = {
  provider: runner,
  cssList: [],
  manifest,
};
