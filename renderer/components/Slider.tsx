import {
  createSignal,
  For,
  type JSX,
  mergeProps,
  onMount,
  splitProps,
} from 'solid-js';

import * as styles from './components.css';

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
    ['min', 'max', 'value', 'step', 'label', 'onChange', 'width'],
  );

  const [slider, setSlider] = createSignal<HTMLDivElement | null>(null);
  const [rect, setRect] = createSignal<DOMRect | null>(null);

  const value = () => (local.value - local.min) / (local.max - local.min);
  const maxWidth = () => (rect()?.width ?? 16) - 16;

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
    const now = Math.min(Math.max(0, event.pageX - domRect.left - 6), max);
    const value = local.min + (now / max) * (local.max - local.min);
    const newValue = ~~(value / local.step) * local.step;

    local.onChange?.(newValue);
  };

  onMount(() => {
    const element = slider();
    if (!element) return;

    setRect(element.getBoundingClientRect());
  });

  return (
    <div
      {...leftProps}
      class={
        local.label.length > 0
          ? `${styles.sliderRoot} ${styles.sliderRootWithLabels}`
          : styles.sliderRoot
      }
      onPointerDown={onMoveStart}
      ref={setSlider}
      style={{
        '--value': value(),
        'width': local.width,
      }}
    >
      <div class={styles.sliderRail} />
      <div class={styles.sliderFill} />
      <div
        class={styles.sliderThumb}
        style={`translate: calc(var(--value, 0) * ${maxWidth()}px) 0;`}
      />
      <For each={local.label}>
        {(item) => (
          <div
            class={styles.sliderLabel}
            style={`left: ${((item.value - local.min) / (local.max - local.min)) * maxWidth() + 8}px;`}
          >
            {item.label}
          </div>
        )}
      </For>
    </div>
  );
};
