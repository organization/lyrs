import { Box, token } from '@suis-ui/kit';
import { splitProps } from 'solid-js';

import * as styles from './setting-layout.css';

import { cx } from '../../../utils/classNames';

import type { DivBoxProps } from './types';

export const UnitInput = (props: DivBoxProps) => (
  <Box {...props} align="center" direction="row" gap="xs" />
);

export const EmptyState = (props: DivBoxProps) => {
  const [local, leftProps] = splitProps(props, ['class']);

  return (
    <Box
      {...leftProps}
      c="text.caption"
      class={cx(styles.emptyState, local.class)}
      p="xl"
    />
  );
};

export const CheckPlaceholder = (props: DivBoxProps) => {
  const [local, leftProps] = splitProps(props, ['class']);

  return (
    <Box
      {...leftProps}
      class={cx(styles.checkPlaceholder, local.class)}
      h={token.size['1']}
      w={token.size['1']}
    />
  );
};

export const CodeBlock = (props: DivBoxProps) => {
  const [local, leftProps] = splitProps(props, ['class']);

  return (
    <Box
      {...leftProps}
      as="pre"
      class={cx(styles.codeBlock, local.class)}
      p="md"
      r="sm"
    />
  );
};
