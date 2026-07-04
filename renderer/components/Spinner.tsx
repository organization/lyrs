import { LoaderCircle } from 'lucide-solid';
import { mergeProps, splitProps } from 'solid-js';

import * as styles from './components.css';

import type { JSX } from 'solid-js/jsx-runtime';

export interface SpinnerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  strokeWidth?: number;
  size?: string;
}
const Spinner = (props: SpinnerProps): JSX.Element => {
  const [local, leftProps] = splitProps(
    mergeProps({ size: '2rem', strokeWidth: 2 }, props),
    ['strokeWidth', 'size'],
  );

  return (
    <div {...leftProps} class={styles.spinnerRoot}>
      <LoaderCircle
        class={styles.spinnerSvg}
        size={local.size}
        strokeWidth={local.strokeWidth}
      />
    </div>
  );
};

export default Spinner;
