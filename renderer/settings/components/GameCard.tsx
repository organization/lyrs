import { Marquee } from '@suyongs/solid-utility';
import { type JSX, Show, createSignal } from 'solid-js';

import Card from '../../components/Card';

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
      class={'w-full flex justify-start items-center gap-4'}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Show
        fallback={<div class={'w-6 h-6 aspect-square'} />}
        when={!!props.icon}
      >
        <img alt={'Icon'} class={'w-6 h-6 object-cover'} src={props.icon} />
      </Show>
      <div class={'w-0 flex flex-col justify-center items-stretch flex-1'}>
        <div class={'w-full'}>{props.name}</div>
        <Marquee
          class={'text-gray-400'}
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
