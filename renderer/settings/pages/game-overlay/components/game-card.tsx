import { Marquee } from '@suyongs/solid-utility';
import { type JSX, Show, createSignal } from 'solid-js';

import Card from '../../../../components/card';
import {
  CardCaptionLarge,
  CardSummary,
  CardSummaryLine,
  CheckPlaceholder,
  IconImage,
} from '../../../components/setting-layout';

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
      <Show fallback={<CheckPlaceholder />} when={!!props.icon}>
        <IconImage alt={'Icon'} src={props.icon} />
      </Show>
      <CardSummary>
        <CardSummaryLine>{props.name}</CardSummaryLine>
        <CardCaptionLarge>
          <Marquee gap={18} mode={hover() ? 'auto' : 'truncate'}>
            {props.path}
          </Marquee>
        </CardCaptionLarge>
      </CardSummary>
      {props.children}
    </Card>
  );
};

export default GameCard;
