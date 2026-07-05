import { Select as KitSelect } from '@suis-ui/kit';

import type { JSX } from 'solid-js/jsx-runtime';

export interface SelectProps<T extends string> extends Omit<
  JSX.HTMLAttributes<HTMLElement>,
  'value' | 'onChange'
> {
  mode?: 'select' | 'autocomplete';

  placeholder?: string;

  options: T[];
  value?: T;
  onChange?: (value: T, index: number) => void;
  format?: (value: T) => string;
  width?: string;
  minWidth?: string;

  popupClass?: string;
  popupStyle?: string;

  renderItem?: (
    props: JSX.HTMLAttributes<HTMLLIElement>,
    option: string,
    isSelected: boolean,
  ) => JSX.Element;
}

const Selector = <T extends string>(props: SelectProps<T>) => {
  const data = () =>
    props.options.map((option) => ({
      value: option,
      label: props.format?.(option) ?? option,
    }));

  const onChange = (selected: { value: string } | null) => {
    if (!selected) return;

    const index = props.options.findIndex(
      (option) => option === selected.value,
    );
    props.onChange?.(selected.value as T, index);
  };

  return (
    <KitSelect
      data={data()}
      minW={props.minWidth}
      onChange={onChange}
      placeholder={props.placeholder}
      style={props.style}
      value={props.value ?? null}
      w={props.width}
    />
  );
};

export default Selector;
