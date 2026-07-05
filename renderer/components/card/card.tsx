import { Box, token, vars } from '@suis-ui/kit';
import { ChevronDown, ChevronUp } from 'lucide-solid';
import { createSignal, For, Match, Show, splitProps, Switch } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';

import * as styles from './card.css';

import { cx } from '../../utils/classNames';

import type { JSX } from 'solid-js/jsx-runtime';

const cardMinHeight = `calc(${token.size['9']} + ${vars.size.space.xs} - ${vars.size.line.md})`;

export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  expand?: boolean;
  setExpand?: (expand: boolean) => void;
  onExpand?: (expand: boolean) => void;
  justify?: 'start' | 'between' | 'center';

  subCards?: JSX.Element[];
}

const Card = (props: CardProps) => {
  const [local, leftProps] = splitProps(props, [
    'expand',
    'setExpand',
    'onExpand',
    'subCards',
    'justify',
    'class',
    'classList',
  ]);

  const [expand, setExpand] = local.setExpand
    ? [() => local.expand, local.setExpand]
    : createSignal(local.expand);

  const isSubCard = () => 'subCards' in local;

  const onClick: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = (
    event,
  ) => {
    if (isSubCard()) {
      const isExpand = !(expand() ?? false);
      setExpand(isExpand);
      local.onExpand?.(isExpand);
    }

    if (typeof leftProps.onClick === 'function')
      return leftProps.onClick(event);
  };

  const mainCard = (
    <Box
      {...leftProps}
      align="center"
      bg="surface.high"
      blr={isSubCard() && expand() ? 'none' : 'sm'}
      brr={isSubCard() && expand() ? 'none' : 'sm'}
      c="text.main"
      class={cx(
        styles.cardInteractive,
        local.class,
      )}
      direction="row"
      gap="md"
      justify={
        local.justify === 'between'
          ? 'space-between'
          : local.justify === 'center'
            ? 'center'
            : undefined
      }
      minH={cardMinHeight}
      onClick={onClick}
      pos="relative"
      px="lg"
      py="md"
      shadow="xs"
      tlr="sm"
      trr="sm"
      w="100%"
    >
      {leftProps.children}
      <Switch>
        <Match when={expand() === true}>
          <ChevronUp class={styles.cardChevron} />
        </Match>
        <Match when={isSubCard()}>
          <ChevronDown class={styles.cardChevron} />
        </Match>
      </Switch>
    </Box>
  );

  return (
    <Show fallback={mainCard} when={isSubCard()}>
      <Box align="stretch" direction="column" style={{ gap: vars.size.line.md }}>
        {mainCard}
        <TransitionGroup name={'card'}>
          <Show when={expand()}>
            <For each={local.subCards}>
              {(element, index) => (
                <Box
                  align="center"
                  bg="surface.high"
                  blr={
                    index() === local.subCards!.length - 1 ? 'sm' : 'none'
                  }
                  brr={
                    index() === local.subCards!.length - 1 ? 'sm' : 'none'
                  }
                  c="text.main"
                  class={styles.cardInteractive}
                  direction="row"
                  gap="md"
                  minH={cardMinHeight}
                  pos="relative"
                  px="lg"
                  py="md"
                  shadow="xs"
                  tlr="none"
                  trr="none"
                  w="100%"
                >
                  {element}
                </Box>
              )}
            </For>
          </Show>
        </TransitionGroup>
      </Box>
    </Show>
  );
};

export default Card;
