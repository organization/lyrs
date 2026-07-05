import { Box, token } from '@suis-ui/kit';
import { LoaderCircle } from 'lucide-solid';
import { mergeProps, splitProps } from 'solid-js';

import * as styles from './spinner.css';

import type { JSX } from 'solid-js/jsx-runtime';

export interface SpinnerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  strokeWidth?: number;
  size?: string;
}
const Spinner = (props: SpinnerProps): JSX.Element => {
  const [local, leftProps] = splitProps(
    mergeProps({ size: token.size['2'], strokeWidth: 2 }, props),
    ['strokeWidth', 'size', 'class'],
  );

  return (
    <Box
      {...leftProps}
      align="center"
      c="primary.main"
      direction="row"
      justify="center"
    >
      <LoaderCircle
        class={styles.spinnerSvg}
        size={local.size}
        strokeWidth={local.strokeWidth}
      />
    </Box>
  );
};

export default Spinner;
