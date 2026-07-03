import { ChevronDown, ChevronUp } from 'lucide-solid';
import { createSignal, For, Match, Show, splitProps, Switch } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';

import * as styles from './components.css';

import { cx } from '../utils/classNames';

import type { JSX } from 'solid-js/jsx-runtime';

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
    <div
      {...leftProps}
      class={cx(
        styles.card,
        local.justify === 'between' && styles.cardJustifyBetween,
        local.justify === 'center' && styles.cardJustifyCenter,
        local.class,
        isSubCard() && styles.cardSubRoot,
        isSubCard() && !expand() && styles.cardCollapsedSubRoot,
      )}
      onClick={onClick}
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
    </div>
  );

  return (
    <Show fallback={mainCard} when={isSubCard()}>
      <div class={styles.cardStack}>
        {mainCard}
        <TransitionGroup name={'card'}>
          <Show when={expand()}>
            <For each={local.subCards}>
              {(element, index) => (
                <Card
                  class={cx(
                    styles.cardChild,
                    index() === local.subCards!.length - 1 &&
                      styles.cardLastChild,
                  )}
                >
                  {element}
                </Card>
              )}
            </For>
          </Show>
        </TransitionGroup>
      </div>
    </Show>
  );
};

export default Card;
