import { Trans } from '@jellybrick/solid-i18next';
import { For } from 'solid-js';

import * as styles from './anchor-grid.css';

import Card from '../../../components/Card';
import { cx } from '../../../utils/classNames';
import { PositionGrid } from '../position-grid';

export const ANCHORS = [
  'top-left',
  'top',
  'top-right',
  'left',
  'center',
  'right',
  'bottom-left',
  'bottom',
  'bottom-right',
] as const;

export type AnchorValue = (typeof ANCHORS)[number];

export interface AnchorGridProps {
  isAnchorEnabled?: (anchor: AnchorValue) => boolean;
  isAnchorSelected: (anchor: AnchorValue) => boolean;
  onSelectAnchor: (anchor: AnchorValue) => void;
}

const anchorClass = (
  anchor: AnchorValue,
  enabled: boolean,
  selected: boolean,
) =>
  cx(
    styles.anchorCard,
    anchor.includes('top') && styles.anchorTop,
    !anchor.includes('top') &&
      !anchor.includes('bottom') &&
      styles.anchorMiddle,
    anchor.includes('bottom') && styles.anchorBottom,
    anchor.includes('left') && styles.anchorLeft,
    !anchor.includes('left') &&
      !anchor.includes('right') &&
      styles.anchorCenter,
    anchor.includes('right') && styles.anchorRight,
    !enabled && styles.anchorDisabled,
    selected && styles.anchorSelected,
  );

const AnchorGrid = (props: AnchorGridProps) => (
  <PositionGrid>
    <For each={ANCHORS}>
      {(anchor) => {
        const enabled = () => props.isAnchorEnabled?.(anchor) ?? true;

        return (
          <Card
            class={anchorClass(
              anchor,
              enabled(),
              props.isAnchorSelected(anchor),
            )}
            onClick={() => {
              if (!enabled()) return;
              props.onSelectAnchor(anchor);
            }}
          >
            <Trans key={`setting.position.${anchor}`} />
          </Card>
        );
      }}
    </For>
  </PositionGrid>
);

export default AnchorGrid;
