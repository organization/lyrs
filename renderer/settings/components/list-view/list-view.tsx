import {
  For,
  Show,
  type JSX,
  type Signal,
  createSignal,
  onMount,
  splitProps,
} from 'solid-js';

import * as styles from './list-view.css';

import { ScrollArea } from '../../../components/scroll-area';
import { cx } from '../../../utils/classNames';

export interface ListItemData {
  id: string;
  label: string;
  icon?: string | JSX.Element;
}
export interface ListViewProps extends JSX.HTMLAttributes<HTMLUListElement> {
  items: ListItemData[];
  initItem?: string;
  onSelectItem?: (data: ListItemData) => void;

  value?: Signal<string>;
}

interface ListItemProps extends JSX.LiHTMLAttributes<HTMLLIElement> {
  icon?: string | JSX.Element;
  selected?: boolean;
  title?: string;
}

const ListItem = (props: ListItemProps) => {
  const [local, leftProps] = splitProps(props, ['icon', 'selected', 'title']);

  return (
    <li
      {...leftProps}
      class={cx(
        styles.navItem,
        local.selected && styles.navItemSelected,
        leftProps.class,
      )}
    >
      <Show
        fallback={local.icon as JSX.Element}
        when={typeof local.icon === 'string'}
      >
        <img alt="Local Icon" src={local.icon as string} />
      </Show>
      <div class={styles.navItemTitle}>{local.title}</div>
    </li>
  );
};

const ListView = (props: ListViewProps) => {
  const [local, leftProps] = splitProps(props, [
    'items',
    'onSelectItem',
    'value',
  ]);

  const [tab, setTab] =
    local.value ?? createSignal(props.initItem ?? local.items[0].id);
  const [tabHeight, setTabHeight] = createSignal<number[]>([]);
  const index = () => local.items.findIndex((item) => item.id === tab());

  let listParent: HTMLUListElement | undefined;

  onMount(() => {
    const newTabHeight: number[] = [];

    const offset = listParent?.getBoundingClientRect()?.y ?? 0;
    Array.from(listParent?.children ?? []).forEach((item) => {
      if (!(item instanceof HTMLElement) || !item.dataset.listViewItem) return;

      const rect = item.getBoundingClientRect();
      newTabHeight.push(rect.y - offset);
    });

    setTabHeight(newTabHeight);
  });

  const onSelect = (item: ListItemData) => {
    setTab(item.id);
    local.onSelectItem?.(item);
  };

  return (
    <ScrollArea
      align="stretch"
      class={styles.navScrollArea}
      direction="column"
      fadeAxes="y"
      overflow="yAuto"
    >
      <ul
        {...leftProps}
        class={cx(styles.navList, leftProps.class)}
        ref={listParent}
      >
        <li
          aria-hidden="true"
          class={cx(
            styles.navIndicator,
            typeof tabHeight()[index()] !== 'number' &&
              styles.navIndicatorHidden,
          )}
          style={{ translate: `0px ${tabHeight()[index()] + 1}px` }}
        />
        <For each={local.items}>
          {(item) => (
            <ListItem
              data-list-view-item="true"
              icon={item.icon}
              onClick={() => onSelect(item)}
              selected={tab() === item.id}
              title={item.label}
            />
          )}
        </For>
      </ul>
    </ScrollArea>
  );
};

export default ListView;
