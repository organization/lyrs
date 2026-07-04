import * as styles from './components.css';
import { TitleBar } from './title-bar';

import type { JSX } from 'solid-js/jsx-runtime';

interface LayoutProps {
  children: JSX.Element;
}
const Layout = (props: LayoutProps) => {
  return (
    <div class={styles.layoutRoot}>
      <TitleBar />
      <div class={styles.layoutBody}>{props.children}</div>
    </div>
  );
};

export default Layout;
