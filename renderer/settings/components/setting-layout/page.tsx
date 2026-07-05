import { Box } from '@suis-ui/kit';
import { ChevronRight } from 'lucide-solid';
import { createSignal, splitProps, type JSX } from 'solid-js';

import { iconSmallProps } from './icon-props';
import * as styles from './setting-layout.css';

import { ScrollArea } from '../../../components/scroll-area';
import { cx } from '../../../utils/classNames';

import type { DivBoxProps } from './types';

export interface PageRootProps extends DivBoxProps {
  flushX?: boolean;
}

export const PageRoot = (props: PageRootProps) => {
  const [local, leftProps] = splitProps(props, ['flushX']);

  return (
    <ScrollArea
      {...leftProps}
      align="stretch"
      direction="column"
      fadeAxes="y"
      flex={1}
      gap="xs"
      justify="flex-start"
      minH="0"
      minW="0"
      overflow="yAuto"
      p={local.flushX ? undefined : 'lg'}
      py={local.flushX ? 'lg' : undefined}
    />
  );
};

export const PageTitle = (props: DivBoxProps) => (
  <Box {...props} mb="xs" text="h1" />
);

export interface PageBreadcrumbProps extends DivBoxProps {
  current: JSX.Element;
  onParentClick: () => void;
  parent: JSX.Element;
}

export const PageBreadcrumb = (props: PageBreadcrumbProps) => {
  const [local, leftProps] = splitProps(props, [
    'class',
    'current',
    'onParentClick',
    'parent',
  ]);
  const [parentHover, setParentHover] = createSignal(false);

  return (
    <Box
      px="lg"
      {...leftProps}
      align="center"
      class={cx(styles.breadcrumbRoot, local.class)}
      direction="row"
      gap="sm"
      mb="xs"
      text="h1"
    >
      <Box
        as="span"
        class={styles.breadcrumbParent}
        onClick={local.onParentClick}
        onMouseEnter={() => setParentHover(true)}
        onMouseLeave={() => setParentHover(false)}
        style={{ opacity: parentHover() ? 1 : 0.8 }}
      >
        {local.parent}
      </Box>
      <ChevronRight {...iconSmallProps} />
      <Box as="span">{local.current}</Box>
    </Box>
  );
};
