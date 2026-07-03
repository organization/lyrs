import { Marquee } from '@suyongs/solid-utility';
import { type JSX, Show, createSignal } from 'solid-js';

import Card from '../../components/Card';
import * as settingsStyles from '../settings.css';

export interface GameCardProps {
  icon?: string;
  name: string;
  path?: string;
  children?: JSX.Element;
}

const GameCard = (props: GameCardProps) => {
  const [hover, setHover] = createSignal(false);

  return (
    <Card
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Show
        fallback={<div class={settingsStyles.checkPlaceholder} />}
        when={!!props.icon}
      >
        <img alt={'Icon'} class={settingsStyles.iconMedium} src={props.icon} />
      </Show>
      <div class={settingsStyles.pluginSummary}>
        <div class={settingsStyles.pluginNameLine}>{props.name}</div>
        <Marquee
          class={settingsStyles.cardCaptionLarge}
          gap={18}
          mode={hover() ? 'auto' : 'truncate'}
        >
          {props.path}
        </Marquee>
      </div>
      {props.children}
    </Card>
  );
};

export default GameCard;
