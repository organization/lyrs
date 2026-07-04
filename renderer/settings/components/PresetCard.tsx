import { Check } from 'lucide-solid';
import { Show, splitProps } from 'solid-js';

import Card from '../../components/Card';
import { cx } from '../../utils/classNames';
import * as settingsStyles from '../settings.css';

import type { JSX } from 'solid-js/jsx-runtime';

export interface PresetCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  name: string;
  url?: string;
}
const PresetCard = (props: PresetCardProps) => {
  const [local, leftProps] = splitProps(props, ['selected', 'name', 'url']);

  return (
    <Card {...leftProps} class={cx(settingsStyles.presetCard, leftProps.class)}>
      <img
        alt={'Preset Image'}
        class={settingsStyles.presetImage}
        src={local.url}
      />
      <div
        class={cx(
          settingsStyles.presetLabel,
          local.selected && settingsStyles.presetLabelSelected,
        )}
      >
        <Show when={local.selected}>
          <Check size={16} />
        </Show>
        {local.name}
      </div>
      <Show when={local.selected}>
        <div class={settingsStyles.presetOutline} />
      </Show>
    </Card>
  );
};

export default PresetCard;
