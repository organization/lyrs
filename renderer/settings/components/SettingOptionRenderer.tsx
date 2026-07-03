import { Marquee } from '@suyongs/solid-utility';
import { Match, Switch as SwitchFlow } from 'solid-js';

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
      <div
        class={
          'w-[0] flex flex-col justify-center items-stretch flex-1 basis-[100%]'
        }
      >
        <Marquee class={'w-full'}>{props.option.name}</Marquee>
        <Marquee class={'text-gray-400'} gap={18}>
          {props.option.description}
        </Marquee>
      </div>
      <div class={'flex-1'} />
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
          <input
            class={'input'}
            onChange={(event) => props.onChange?.(event.target.value as Type)}
            type={'text'}
            value={props.value as string}
          />
        </Match>
        <Match when={props.option.type === 'number'}>
          <input
            class={'input'}
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
          <button
            classList={{
              'btn-primary':
                ((props.option as ButtonOption).variant ?? 'primary') ===
                'primary',
              'btn-secondary':
                (props.option as ButtonOption).variant === 'secondary',
              'btn-error': (props.option as ButtonOption).variant === 'error',
            }}
            onClick={() => props.onClick?.()}
          >
            {(props.option as ButtonOption).label}
          </button>
        </Match>
      </SwitchFlow>
    </>
  );
};
