import { Box, Button, Input } from '@suis-ui/kit';
import { Marquee } from '@suyongs/solid-utility';
import { Match, Switch as SwitchFlow } from 'solid-js';

import * as componentStyles from '../../components/components.css';
import Selector from '../../components/Select';
import Switch from '../../components/Switch';

import type {
  ButtonOption,
  NumberOption,
  SelectOption,
  SettingOption,
} from '../../../common/plugins';

export interface SettingOptionRendererProps<Type> {
  option: SettingOption;

  value?: Type;
  onChange?: (value: Type) => void;
  onClick?: () => void;
}
export const SettingOptionRenderer = <Type,>(
  props: SettingOptionRendererProps<Type>,
) => {
  return (
    <>
      <Box
        align="stretch"
        direction="column"
        flex="1 1 100%"
        justify="center"
        w="0"
      >
        <Marquee>{props.option.name}</Marquee>
        <Marquee gap={18}>
          {props.option.description}
        </Marquee>
      </Box>
      <Box flex={1} />
      <SwitchFlow>
        <Match when={props.option.type === 'select'}>
          <Selector
            format={(option) =>
              (props.option as SelectOption).options.find(
                (it) => it.value === option,
              )?.label ?? option
            }
            onChange={(value) => props.onChange?.(value as Type)}
            options={(props.option as SelectOption).options.map(
              ({ value }) => value,
            )}
            value={props.value as string}
          />
        </Match>
        <Match when={props.option.type === 'string'}>
          <Input
            onChange={(event) => props.onChange?.(event.target.value as Type)}
            type={'text'}
            value={props.value as string}
          />
        </Match>
        <Match when={props.option.type === 'number'}>
          <Input
            max={(props.option as NumberOption).max}
            min={(props.option as NumberOption).min}
            onChange={(event) => props.onChange?.(event.target.value as Type)}
            step={(props.option as NumberOption).step}
            type={'number'}
            value={props.value as string}
          />
        </Match>
        <Match when={props.option.type === 'boolean'}>
          <Switch
            onChange={(checked) => props.onChange?.(checked as Type)}
            value={props.value as boolean}
          />
        </Match>
        <Match when={props.option.type === 'button'}>
          <Button
            class={
              (props.option as ButtonOption).variant === 'error'
                ? componentStyles.dangerButton
                : undefined
            }
            onClick={() => props.onClick?.()}
            variant={
              (props.option as ButtonOption).variant === 'secondary'
                ? 'secondary'
                : 'primary'
            }
          >
            {(props.option as ButtonOption).label}
          </Button>
        </Match>
      </SwitchFlow>
    </>
  );
};
