import { Box, type BoxProps } from '@suis-ui/kit';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import {
  onCleanup,
  onMount,
  splitProps,
  type JSX,
  type ValidComponent,
} from 'solid-js';

import {
  bottomShade,
  fadeColor,
  fadeSize,
  leftShade,
  rightShade,
  scrollbarAlwaysStyle,
  scrollbarBaseStyle,
  scrollbarHiddenStyle,
  scrollbarHoverStyle,
  scrollAreaStyle,
  shadeVisible,
  topShade,
  x,
  y,
} from './scroll-area.css';
import { ScrollTrack } from './scroll-track';
import { useScrollbar } from './use-scrollbar';

import { cx } from '../../utils/classNames';

type FadeAxes = 'x' | 'y' | 'both' | 'none';
type ScrollbarVisibility = 'hover' | 'always' | 'hidden';

type ScrollAreaOnlyProps<T extends ValidComponent> = {
  children?: JSX.Element;
  class?: string;
  fadeAxes?: FadeAxes;
  fadeSize?: string;
  fadeColor?: string;
  onScroll?: BoxProps<T> extends { onScroll?: infer OnScroll }
    ? OnScroll
    : JSX.EventHandlerUnion<HTMLElement, Event>;
  ref?: BoxProps<T> extends { ref?: infer Ref }
    ? Ref
    : HTMLElement | ((element: HTMLElement) => void);
  scrollbarVisibility?: ScrollbarVisibility;
  style?: BoxProps<T> extends { style?: infer Style }
    ? Style
    : JSX.CSSProperties | string;
};
type ScrollEvent = Event & {
  currentTarget: HTMLElement;
  target: Element;
};
type ScrollHandler = JSX.EventHandlerUnion<HTMLElement, Event>;
export type ScrollAreaProps<T extends ValidComponent> = Omit<
  BoxProps<T>,
  keyof ScrollAreaOnlyProps<T>
> &
  ScrollAreaOnlyProps<T>;

const DATA_SCROLL_AREA_CONTROL = 'scrollAreaControl';

export const ScrollArea = <T extends ValidComponent>(
  props: ScrollAreaProps<T>,
) => {
  const [local, leftProps] = splitProps(props, [
    'children',
    'class',
    'fadeAxes',
    'fadeColor',
    'fadeSize',
    'onScroll',
    'ref',
    'scrollbarVisibility',
    'style',
  ]);

  let scrollArea: HTMLElement | undefined;
  let resizeObserver: ResizeObserver | undefined;
  let mutationObserver: MutationObserver | undefined;

  const scrollbar = useScrollbar({
    getScrollArea: () => scrollArea,
  });

  const fadeAxes = (): FadeAxes => {
    switch (local.fadeAxes) {
      case 'x':
        return 'x';
      case 'y':
        return 'y';
      case 'both':
        return 'both';
      case 'none':
        return 'none';
      default:
        return 'both';
    }
  };
  const canFadeX = () => fadeAxes() === 'x' || fadeAxes() === 'both';
  const canFadeY = () => fadeAxes() === 'y' || fadeAxes() === 'both';
  const scrollbarVisibility = (): ScrollbarVisibility => {
    switch (local.scrollbarVisibility ?? 'hover') {
      case 'always':
        return 'always';
      case 'hidden':
        return 'hidden';
      case 'hover':
      default:
        return 'hover';
    }
  };
  const scrollbarVisibilityClass = () => {
    switch (scrollbarVisibility()) {
      case 'always':
        return scrollbarAlwaysStyle;
      case 'hidden':
        return scrollbarHiddenStyle;
      case 'hover':
        return scrollbarHoverStyle;
    }
  };
  const canShowScrollbars = () => scrollbarVisibility() !== 'hidden';

  const isScrollAreaControl = (node: Node) =>
    node instanceof HTMLElement &&
    node.dataset[DATA_SCROLL_AREA_CONTROL] !== undefined;
  const isInsideScrollAreaControl = (node: Node) => {
    if (node instanceof Element) {
      return node.closest('[data-scroll-area-control]') !== null;
    }

    return node.parentElement?.closest('[data-scroll-area-control]') !== null;
  };
  const mutationTouchesScrollableContent = (mutation: MutationRecord) => {
    if (isInsideScrollAreaControl(mutation.target)) return false;

    if (mutation.type !== 'childList') return true;

    return [...mutation.addedNodes, ...mutation.removedNodes].some(
      (node) => !isInsideScrollAreaControl(node),
    );
  };

  const observeScrollableContent = () => {
    resizeObserver?.disconnect();

    if (!scrollArea || typeof ResizeObserver === 'undefined') return;

    resizeObserver = new ResizeObserver(scrollbar.scheduleScrollStateUpdate);
    resizeObserver.observe(scrollArea);

    Array.from(scrollArea.children).forEach((child) => {
      if (!(child instanceof HTMLElement)) return;
      if (isScrollAreaControl(child)) return;

      resizeObserver?.observe(child);
    });
  };

  const assignRef = (element: HTMLElement) => {
    scrollArea = element;

    if (typeof local.ref === 'function') {
      (local.ref as (element: HTMLElement) => void)(element);
    }
  };

  const inlineStyle = () => {
    const currentMetrics = scrollbar.metrics();
    const internalStyle = assignInlineVars({
      [fadeSize]: local.fadeSize,
      [fadeColor]: local.fadeColor,
      [x]: `${currentMetrics.scrollLeft}px`,
      [y]: `${currentMetrics.scrollTop}px`,
    });

    const localStyle = local.style as JSX.CSSProperties | string | undefined;

    if (typeof localStyle === 'string') {
      const inlineVars = Object.entries(internalStyle)
        .filter((entry): entry is [string, string] => entry[1] !== undefined)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');

      return inlineVars.length > 0
        ? `${localStyle}; ${inlineVars};`
        : localStyle;
    }

    return {
      ...internalStyle,
      ...localStyle,
    };
  };

  const onScroll = (e: Event) => {
    scrollbar.updateScrollState();

    const handler = local.onScroll as ScrollHandler | undefined;
    const event = e as ScrollEvent;

    if (typeof handler === 'function') {
      handler(event);
      return;
    }

    if (handler) {
      handler[0](handler[1], event);
    }
  };

  onMount(() => {
    scrollbar.scheduleScrollStateUpdate();
    observeScrollableContent();

    if (scrollArea && typeof MutationObserver !== 'undefined') {
      mutationObserver = new MutationObserver((mutations) => {
        if (!mutations.some(mutationTouchesScrollableContent)) return;

        observeScrollableContent();
        scrollbar.scheduleScrollStateUpdate();
      });
      mutationObserver.observe(scrollArea, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    }
  });

  onCleanup(() => {
    resizeObserver?.disconnect();
    mutationObserver?.disconnect();
  });

  return (
    <Box
      {...(leftProps as BoxProps<T>)}
      class={cx(
        scrollbarBaseStyle,
        scrollbarVisibilityClass(),
        scrollAreaStyle,
        local.class,
      )}
      onScroll={onScroll}
      ref={assignRef}
      style={inlineStyle()}
    >
      {local.children}
      {canShowScrollbars() && scrollbar.hasVerticalOverflow() && (
        <ScrollTrack
          axis="y"
          getThumbMetrics={scrollbar.getThumbMetrics}
          onThumbPointerDown={scrollbar.startScrollbarDrag}
          onThumbPointerMove={scrollbar.onScrollbarThumbPointerMove}
          onThumbPointerUp={scrollbar.finishScrollbarDrag}
          scrollToTrackPosition={scrollbar.scrollToTrackPosition}
        />
      )}
      {canShowScrollbars() && scrollbar.hasHorizontalOverflow() && (
        <ScrollTrack
          axis="x"
          getThumbMetrics={scrollbar.getThumbMetrics}
          onThumbPointerDown={scrollbar.startScrollbarDrag}
          onThumbPointerMove={scrollbar.onScrollbarThumbPointerMove}
          onThumbPointerUp={scrollbar.finishScrollbarDrag}
          scrollToTrackPosition={scrollbar.scrollToTrackPosition}
        />
      )}
      <div
        aria-hidden="true"
        class={cx(topShade, canFadeY() && scrollbar.edges().top && shadeVisible)}
        data-scroll-area-control=""
        data-scroll-area-shade=""
      />
      <div
        aria-hidden="true"
        class={cx(
          bottomShade,
          canFadeY() && scrollbar.edges().bottom && shadeVisible,
        )}
        data-scroll-area-control=""
        data-scroll-area-shade=""
      />
      <div
        aria-hidden="true"
        class={cx(
          leftShade,
          canFadeX() && scrollbar.edges().left && shadeVisible,
        )}
        data-scroll-area-control=""
        data-scroll-area-shade=""
      />
      <div
        aria-hidden="true"
        class={cx(
          rightShade,
          canFadeX() && scrollbar.edges().right && shadeVisible,
        )}
        data-scroll-area-control=""
        data-scroll-area-shade=""
      />
    </Box>
  );
};
