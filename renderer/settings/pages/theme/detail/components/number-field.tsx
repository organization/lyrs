import { Box, Input, token } from '@suis-ui/kit';
import { Show } from 'solid-js';

import { UnitInput } from '../../../../components/setting-layout';

export interface NumberFieldProps {
  value?: number;
  onChange: (value: number) => void;
  unit?: string;
  min?: number;
  step?: number;
  placeholder?: string;
  width?: string;
}

const NumberField = (props: NumberFieldProps) => (
  <UnitInput>
    <Input
      min={props.min}
      onChange={(event) => props.onChange(event.target.valueAsNumber)}
      placeholder={props.placeholder}
      step={props.step}
      type="number"
      value={props.value}
      w={props.width ?? `calc(${token.size['9']} * 2)`}
    />
    <Show when={props.unit}>
      <Box text="caption">{props.unit}</Box>
    </Show>
  </UnitInput>
);

export default NumberField;
