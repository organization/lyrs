import { Box, token, vars } from '@suis-ui/kit';
import {
  createSignal,
  For,
  type JSX,
  mergeProps,
  onMount,
  splitProps,
} from 'solid-js';

import * as styles from './slider.css';

const SLIDER_THUMB_SIZE_PX = 16;
const SLIDER_POINTER_OFFSET_PX = 6;
const sliderThumbSize = token.size['1'];
const sliderTrackInset = vars.size.space.xs;
const sliderTrackSize = vars.size.space.xs;
const sliderMinWidth = `calc(${token.size['9']} + ${token.size['7']} + ${vars.size.space.sm})`;

interface SliderLabel {
  value: number;
  label: string;
}

export interface SliderProps extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  label?: SliderLabel[];
  width?: string;
}

export const Slider = (props: SliderProps) => {
  const [local, leftProps] = splitProps(
    mergeProps(
      {
        min: 0,
        max: 100,
        step: 1,
        value: 0,
        label: [],
      },
      props,
    ),
    ['min', 'max', 'value', 'step', 'label', 'onChange', 'width', 'class'],
  );

  const [slider, setSlider] = createSignal<HTMLDivElement | null>(null);
  const [rect, setRect] = createSignal<DOMRect | null>(null);

  const value = () => (local.value - local.min) / (local.max - local.min);
  const maxWidth = () =>
    (rect()?.width ?? SLIDER_THUMB_SIZE_PX) - SLIDER_THUMB_SIZE_PX;

  const onMoveStart = (event: PointerEvent) => {
    const element = slider();
    if (!element) return;

    setRect(element.getBoundingClientRect());
    onMove(event);

    const cleanUp = (event: PointerEvent) => {
      onMove(event);

      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', cleanUp);
      window.removeEventListener('pointercancel', cleanUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', cleanUp);
    window.addEventListener('pointercancel', cleanUp);
  };
  const onMove = (event: PointerEvent) => {
    const domRect = rect();
    if (!domRect) return;

    const max = Math.max(1, maxWidth());
    const now = Math.min(
      Math.max(0, event.pageX - domRect.left - SLIDER_POINTER_OFFSET_PX),
      max,
    );
    const value = local.min + ((now / max) * (local.max - local.min));
    const newValue = ~~(value / local.step) * local.step;

    local.onChange?.(newValue);
  };

  onMount(() => {
    const element = slider();
    if (!element) return;

    setRect(element.getBoundingClientRect());
  });

  return (
    <Box
      {...leftProps}
      align="center"
      direction="row"
      h={sliderThumbSize}
      justify="flex-start"
      minW={sliderMinWidth}
      onPointerDown={onMoveStart}
      pb={local.label.length > 0 ? 'xl' : undefined}
      pos="relative"
      ref={setSlider}
      style={{
        '--value': value(),
        'cursor': 'pointer',
      }}
      w={local.width}
    >
      <Box
        bg="surface.higher"
        h={sliderTrackSize}
        left={sliderTrackInset}
        pos="absolute"
        r="full"
        right={sliderTrackInset}
        z={-2}
      />
      <Box
        bg="primary.main"
        class={styles.sliderFill}
        h={sliderTrackSize}
        left={sliderTrackInset}
        pos="absolute"
        r="full"
        right={sliderTrackInset}
        z={-1}
      />
      <Box
        bg="primary.main"
        class={styles.sliderThumb}
        h={sliderThumbSize}
        r="full"
        style={{
          translate: `calc(var(--value, 0) * ${maxWidth()}px) 0`,
        }}
        w={sliderThumbSize}
        z={0}
      />
      <For each={local.label}>
        {(item) => (
          <Box
            bottom="0"
            c="text.main"
            class={styles.sliderLabel}
            pos="absolute"
            style={{
              left: `${
                (((item.value - local.min) / (local.max - local.min)) *
                  maxWidth()) +
                8
              }px`,
            }}
            w="100%"
          >
            {item.label}
          </Box>
        )}
      </For>
    </Box>
  );
};
