import { type JSX, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/classNames';
import * as settingsStyles from '../settings.css';

export interface ListItemProps extends JSX.LiHTMLAttributes<HTMLLIElement> {
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
        settingsStyles.navItem,
        local.selected && settingsStyles.navItemSelected,
        leftProps.class,
      )}
    >
      <Show
        fallback={local.icon as JSX.Element}
        when={typeof local.icon === 'string'}
      >
        <img alt="Local Icon" src={local.icon as string} />
      </Show>
      <div class={settingsStyles.navItemTitle}>{local.title}</div>
    </li>
  );
};

export default ListItem;
