import { Box } from '@suis-ui/kit';

import type { DivBoxProps } from './types';

export const ModalTitle = (props: DivBoxProps) => (
  <Box {...props} mb="sm" text="title" />
);

export const ModalBody = (props: DivBoxProps) => (
  <Box {...props} mb="xs" text="body" />
);
