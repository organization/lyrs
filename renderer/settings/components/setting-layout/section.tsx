import { Box } from '@suis-ui/kit';

import type { DivBoxProps } from './types';

export const SectionTitle = (props: DivBoxProps) => (
  <Box {...props} mb="xs" mt="lg" text="body" />
);

export const SectionStack = (props: DivBoxProps) => (
  <Box {...props} align="stretch" direction="column" gap="xs" />
);
