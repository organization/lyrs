import { createSignal, onCleanup } from 'solid-js';

export type ScrollbarAxis = 'x' | 'y';
export type ScrollAreaMetrics = {
  clientHeight: number;
  clientWidth: number;
  scrollHeight: number;
  scrollLeft: number;
  scrollTop: number;
  scrollWidth: number;
};
export type ScrollEdgeState = {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
};
export type ScrollbarThumbMetrics = {
  offset: number;
  size: number;
};

type ScrollbarDragState = {
  axis: ScrollbarAxis;
  maxScroll: number;
  maxThumbOffset: number;
  pointerId: number;
  pointerStart: number;
  scrollStart: number;
};
type UseScrollbarOptions = {
  getScrollArea: () => HTMLElement | undefined;
};

const MIN_SCROLLBAR_THUMB_SIZE = 24;
const SCROLL_END_TOLERANCE = 1;
const initialEdgeState: ScrollEdgeState = {
  top: false,
  bottom: false,
  left: false,
  right: false,
};
const initialScrollMetrics: ScrollAreaMetrics = {
  clientHeight: 0,
  clientWidth: 0,
  scrollHeight: 0,
  scrollLeft: 0,
  scrollTop: 0,
  scrollWidth: 0,
};

export const useScrollbar = (options: UseScrollbarOptions) => {
  const [metrics, setMetrics] = createSignal(initialScrollMetrics);
  const [edges, setEdges] = createSignal(initialEdgeState);

  let scrollbarDragState: ScrollbarDragState | undefined;
  let updateFrame: number | undefined;

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const hasVerticalOverflow = () => {
    const currentMetrics = metrics();

    return (
      currentMetrics.scrollHeight - currentMetrics.clientHeight >
      SCROLL_END_TOLERANCE
    );
  };
  const hasHorizontalOverflow = () => {
    const currentMetrics = metrics();

    return (
      currentMetrics.scrollWidth - currentMetrics.clientWidth >
      SCROLL_END_TOLERANCE
    );
  };

  const getThumbSize = (
    clientSize: number,
    scrollSize: number,
    trackSize: number,
  ) => {
    if (clientSize <= 0 || scrollSize <= clientSize || trackSize <= 0) {
      return 0;
    }

    return Math.min(
      trackSize,
      Math.max(MIN_SCROLLBAR_THUMB_SIZE, (clientSize / scrollSize) * trackSize),
    );
  };

  const getAxisMetrics = (axis: ScrollbarAxis) => {
    const currentMetrics = metrics();

    return axis === 'y'
      ? {
          clientSize: currentMetrics.clientHeight,
          scrollPosition: currentMetrics.scrollTop,
          scrollSize: currentMetrics.scrollHeight,
        }
      : {
          clientSize: currentMetrics.clientWidth,
          scrollPosition: currentMetrics.scrollLeft,
          scrollSize: currentMetrics.scrollWidth,
        };
  };

  const getThumbMetrics = (axis: ScrollbarAxis): ScrollbarThumbMetrics => {
    const { clientSize, scrollPosition, scrollSize } = getAxisMetrics(axis);
    const size = getThumbSize(clientSize, scrollSize, clientSize);
    const maxThumbOffset = Math.max(0, clientSize - size);
    const maxScroll = Math.max(0, scrollSize - clientSize);
    const offset =
      maxScroll > 0 ? (scrollPosition / maxScroll) * maxThumbOffset : 0;

    return {
      offset: clamp(offset, 0, maxThumbOffset),
      size,
    };
  };

  const updateScrollState = () => {
    const scrollArea = options.getScrollArea();
    if (!scrollArea) return;

    const {
      clientHeight,
      clientWidth,
      scrollHeight,
      scrollLeft,
      scrollTop,
      scrollWidth,
    } = scrollArea;

    setMetrics({
      clientHeight,
      clientWidth,
      scrollHeight,
      scrollLeft,
      scrollTop,
      scrollWidth,
    });
    setEdges({
      top: scrollTop > SCROLL_END_TOLERANCE,
      bottom: scrollTop + clientHeight < scrollHeight - SCROLL_END_TOLERANCE,
      left: scrollLeft > SCROLL_END_TOLERANCE,
      right: scrollLeft + clientWidth < scrollWidth - SCROLL_END_TOLERANCE,
    });
  };

  const scheduleScrollStateUpdate = () => {
    if (typeof requestAnimationFrame !== 'function') {
      updateScrollState();
      return;
    }

    if (updateFrame !== undefined) cancelAnimationFrame(updateFrame);
    updateFrame = requestAnimationFrame(() => {
      updateFrame = undefined;
      updateScrollState();
    });
  };

  const setScrollPosition = (axis: ScrollbarAxis, value: number) => {
    const scrollArea = options.getScrollArea();
    if (!scrollArea) return;

    if (axis === 'y') {
      scrollArea.scrollTop = value;
    } else {
      scrollArea.scrollLeft = value;
    }

    updateScrollState();
  };

  const getScrollRange = (axis: ScrollbarAxis) => {
    const { clientSize, scrollPosition, scrollSize } = getAxisMetrics(axis);

    return {
      clientSize,
      maxScroll: Math.max(0, scrollSize - clientSize),
      scrollPosition,
      scrollSize,
    };
  };

  const scrollToTrackPosition = (
    axis: ScrollbarAxis,
    trackPosition: number,
    trackSize: number,
  ) => {
    const { clientSize, maxScroll, scrollSize } = getScrollRange(axis);
    if (maxScroll <= 0) return;

    const thumbSize = getThumbSize(clientSize, scrollSize, trackSize);
    const maxThumbOffset = Math.max(0, trackSize - thumbSize);
    if (maxThumbOffset <= 0) return;

    const thumbOffset = clamp(
      trackPosition - (thumbSize / 2),
      0,
      maxThumbOffset,
    );

    setScrollPosition(axis, (thumbOffset / maxThumbOffset) * maxScroll);
  };

  const startScrollbarDrag = (axis: ScrollbarAxis, event: PointerEvent) => {
    if (event.button !== 0) return;

    const thumb = event.currentTarget as HTMLDivElement | null;
    const track = thumb?.parentElement;
    if (!thumb || !track) return;

    event.preventDefault();
    event.stopPropagation();

    const trackRect = track.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    const trackSize = axis === 'y' ? trackRect.height : trackRect.width;
    const thumbSize = axis === 'y' ? thumbRect.height : thumbRect.width;
    const { maxScroll, scrollPosition } = getScrollRange(axis);
    const maxThumbOffset = Math.max(0, trackSize - thumbSize);
    if (maxScroll <= 0 || maxThumbOffset <= 0) return;

    scrollbarDragState = {
      axis,
      maxScroll,
      maxThumbOffset,
      pointerId: event.pointerId,
      pointerStart: axis === 'y' ? event.clientY : event.clientX,
      scrollStart: scrollPosition,
    };
    thumb.setPointerCapture(event.pointerId);
  };

  const onScrollbarThumbPointerMove = (event: PointerEvent) => {
    if (!scrollbarDragState || scrollbarDragState.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();

    const pointerPosition =
      scrollbarDragState.axis === 'y' ? event.clientY : event.clientX;
    const delta = pointerPosition - scrollbarDragState.pointerStart;
    const scrollDelta =
      (delta / scrollbarDragState.maxThumbOffset) *
      scrollbarDragState.maxScroll;
    const nextScrollPosition = clamp(
      scrollbarDragState.scrollStart + scrollDelta,
      0,
      scrollbarDragState.maxScroll,
    );

    setScrollPosition(scrollbarDragState.axis, nextScrollPosition);
  };

  const finishScrollbarDrag = (event: PointerEvent) => {
    if (!scrollbarDragState || scrollbarDragState.pointerId !== event.pointerId) {
      return;
    }

    const thumb = event.currentTarget as HTMLDivElement | null;
    if (thumb?.hasPointerCapture(event.pointerId)) {
      thumb.releasePointerCapture(event.pointerId);
    }

    scrollbarDragState = undefined;
  };

  onCleanup(() => {
    scrollbarDragState = undefined;

    if (updateFrame !== undefined) cancelAnimationFrame(updateFrame);
  });

  return {
    edges,
    finishScrollbarDrag,
    getThumbMetrics,
    hasHorizontalOverflow,
    hasVerticalOverflow,
    metrics,
    onScrollbarThumbPointerMove,
    scheduleScrollStateUpdate,
    scrollToTrackPosition,
    startScrollbarDrag,
    updateScrollState,
  };
};
