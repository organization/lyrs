import {
  For,
  type JSX,
  type Signal,
  createSignal,
  onMount,
  splitProps,
} from 'solid-js';

import ListItem from './ListItem';

import { cx } from '../../utils/classNames';
import * as settingsStyles from '../settings.css';

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
    <ul
      {...leftProps}
      class={cx(settingsStyles.navList, leftProps.class)}
      ref={listParent}
    >
      <div
        class={cx(
          settingsStyles.navIndicator,
          typeof tabHeight()[index()] !== 'number' &&
            settingsStyles.navIndicatorHidden,
        )}
        style={`translate: 0px ${tabHeight()[index()] + 1}px;`}
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
  );
};

export default ListView;
