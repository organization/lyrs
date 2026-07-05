import { scrollbarThumb } from './scroll-area.css';

import type { ScrollbarAxis, ScrollbarThumbMetrics } from './use-scrollbar';
import type { JSX } from 'solid-js';

type ScrollThumbProps = {
  axis: ScrollbarAxis;
  getThumbMetrics: (axis: ScrollbarAxis) => ScrollbarThumbMetrics;
  onPointerDown: (axis: ScrollbarAxis, event: PointerEvent) => void;
  onPointerMove: (event: PointerEvent) => void;
  onPointerUp: (event: PointerEvent) => void;
};

export const ScrollThumb = (props: ScrollThumbProps) => {
  const thumbStyle = (): JSX.CSSProperties => {
    const thumb = props.getThumbMetrics(props.axis);

    return props.axis === 'y'
      ? {
          height: `${thumb.size}px`,
          transform: `translate3d(0, ${thumb.offset}px, 0)`,
          width: '100%',
        }
      : {
          height: '100%',
          transform: `translate3d(${thumb.offset}px, 0, 0)`,
          width: `${thumb.size}px`,
        };
  };

  return (
    <div
      aria-hidden="true"
      class={scrollbarThumb}
      onLostPointerCapture={(event) => props.onPointerUp(event)}
      onPointerCancel={(event) => props.onPointerUp(event)}
      onPointerDown={(event) => props.onPointerDown(props.axis, event)}
      onPointerMove={(event) => props.onPointerMove(event)}
      onPointerUp={(event) => props.onPointerUp(event)}
      style={thumbStyle()}
    />
  );
};
