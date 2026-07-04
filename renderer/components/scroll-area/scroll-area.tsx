import { createSignal, splitProps, ValidComponent } from 'solid-js';
import { Box, BoxProps } from '@suis-ui/kit';
import { assignInlineVars } from '@vanilla-extract/dynamic';

import { cx } from '../../utils/classNames';

import { fadeColor, fadeSize, fadeStyle, noScrollbarStyle, x, y } from './scroll-area.css';

type ScrollAreaOnlyProps = {
  fadeSize?: string;
  fadeColor?: string;
};
export type ScrollAreaProps<T extends ValidComponent> = Omit<BoxProps<T>, keyof ScrollAreaOnlyProps> & ScrollAreaOnlyProps;
export const ScrollArea = <T extends ValidComponent>(props: ScrollAreaProps<T>) => {
  const [scroll, setScroll] = createSignal([0, 0]);

  const onScroll = (e: Event) => {
    const target = e.target as HTMLElement;
    setScroll([target.scrollLeft, target.scrollTop]);
    
    return props.onScroll?.(e);
  };
  
  return (
    <Box
      {...props as BoxProps<T>}
      class={cx(noScrollbarStyle, fadeStyle,  props.class)}
      onScroll={onScroll}
      style={assignInlineVars({
        [fadeSize]: props.fadeSize,
        [fadeColor]: props.fadeColor,
        [x]: `${scroll()[0]}px`,
        [y]: `${scroll()[1]}px`,
      })}
    >
      {props.children}
    </Box>
  )
};
