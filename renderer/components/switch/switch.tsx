import { CheckBox } from '@suis-ui/kit';
import { splitProps } from 'solid-js';

import type { JSX } from 'solid-js/jsx-runtime';

export interface SwitchProps extends Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> {
  value?: boolean;
  onChange?: (value: boolean) => void;
}

const Switch = (props: SwitchProps) => {
  const [local, leftProps] = splitProps(props, ['value', 'onChange']);

  return (
    <span
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <CheckBox
        {...leftProps}
        checked={!!local.value}
        onChecked={(checked) => local.onChange?.(checked)}
      />
    </span>
  );
};

export default Switch;
