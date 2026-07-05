import { Box } from '@suis-ui/kit';
import { splitProps } from 'solid-js';

import * as styles from './setting-layout.css';

import { cx } from '../../../utils/classNames';

import type { DivBoxProps } from './types';

export const CardRow = (props: DivBoxProps) => (
  <Box
    {...props}
    align="center"
    direction="row"
    gap="xs"
    justify="flex-start"
    minW="0"
    w="100%"
  />
);

export const CardRowBetween = (props: DivBoxProps) => (
  <CardRow {...props} justify="space-between" />
);

export const CardColumn = (props: DivBoxProps) => (
  <Box
    {...props}
    align="stretch"
    direction="column"
    gap="xs"
    minW="0"
    w="100%"
  />
);

export const CardTitle = (props: DivBoxProps) => <Box {...props} text="body" />;

export const CardCaption = (props: DivBoxProps) => (
  <Box {...props} c="text.caption" text="caption" />
);

export const CardCaptionLarge = (props: DivBoxProps) => (
  <Box {...props} c="text.caption" text="body" />
);

export const CardDescription = (props: DivBoxProps) => {
  const [local, leftProps] = splitProps(props, ['class']);

  return (
    <Box
      {...leftProps}
      c="text.caption"
      class={cx(styles.description, local.class)}
      text="body"
    />
  );
};

export const CardSummary = (props: DivBoxProps) => (
  <Box
    {...props}
    align="stretch"
    direction="column"
    flex={1}
    justify="center"
    minW="0"
  />
);

export const CardSummaryLine = (props: DivBoxProps) => (
  <Box {...props} w="100%" />
);

export const Spacer = (props: DivBoxProps) => <Box {...props} flex={1} />;
