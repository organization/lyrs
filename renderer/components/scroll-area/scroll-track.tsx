import {
  horizontalScrollbarTrack,
  verticalScrollbarTrack,
} from './scroll-area.css';
import { ScrollThumb } from './scroll-thumb';

import type { ScrollbarAxis, ScrollbarThumbMetrics } from './use-scrollbar';

type ScrollTrackProps = {
  axis: ScrollbarAxis;
  getThumbMetrics: (axis: ScrollbarAxis) => ScrollbarThumbMetrics;
  onThumbPointerDown: (axis: ScrollbarAxis, event: PointerEvent) => void;
  onThumbPointerMove: (event: PointerEvent) => void;
  onThumbPointerUp: (event: PointerEvent) => void;
  scrollToTrackPosition: (
    axis: ScrollbarAxis,
    trackPosition: number,
    trackSize: number,
  ) => void;
};

export const ScrollTrack = (props: ScrollTrackProps) => {
  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;

    const track = event.currentTarget as HTMLDivElement | null;
    if (!track || event.target !== track) return;

    event.preventDefault();

    const rect = track.getBoundingClientRect();
    const trackPosition =
      props.axis === 'y' ? event.clientY - rect.top : event.clientX - rect.left;
    const trackSize = props.axis === 'y' ? rect.height : rect.width;

    props.scrollToTrackPosition(props.axis, trackPosition, trackSize);
  };

  return (
    <div
      aria-hidden="true"
      class={props.axis === 'y' ? verticalScrollbarTrack : horizontalScrollbarTrack}
      data-scroll-area-control=""
      onPointerDown={onPointerDown}
    >
      <ScrollThumb
        axis={props.axis}
        getThumbMetrics={props.getThumbMetrics}
        onPointerDown={props.onThumbPointerDown}
        onPointerMove={props.onThumbPointerMove}
        onPointerUp={props.onThumbPointerUp}
      />
    </div>
  );
};
