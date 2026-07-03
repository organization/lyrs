import Color from 'color';
import { createEffect, createSignal } from 'solid-js';

import * as settingsStyles from '../settings.css';

import type { JSX } from 'solid-js/jsx-runtime';

export interface ColorPickerProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onColorChange?: (color: string) => void;
}

const ColorPicker = (props: ColorPickerProps) => {
  const [alpha, setAlpha] = createSignal(0);
  // eslint-disable-next-line solid/reactivity
  const [color, setColor] = createSignal(props.value);

  let slider: HTMLDivElement | undefined;
  let rect: DOMRect | null = null;
  const onMoveStart = (event: PointerEvent) => {
    if (!slider) return;

    rect = slider.getBoundingClientRect();
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
    if (!rect) return;

    const max = 108;
    const now = Math.min(Math.max(0, event.pageX - rect.left - 6), max);

    setAlpha(now / max);
    props.onColorChange?.(
      Color(color())
        .rgb()
        .alpha(now / max)
        .string(),
    );
  };
  const onChangeColor = (color: string) => {
    setColor(color);
    props.onColorChange?.(Color(color).rgb().alpha(alpha()).string());
  };

  createEffect(() => {
    const color = Color(props.value);
    setColor(color.hex());
    setAlpha(color.alpha());
  });

  return (
    <div class={settingsStyles.colorPickerRoot}>
      <input
        class={settingsStyles.colorInput}
        onChange={(event) => onChangeColor(event.target.value)}
        style={{
          '--opacity': Math.max(alpha(), 0.1),
        }}
        type={'color'}
        value={color()}
      />
      <div
        class={settingsStyles.alphaSlider}
        onPointerDown={onMoveStart}
        ref={slider}
        style={{
          '--alpha': `${alpha() * 108}px`,
        }}
      >
        <div class={settingsStyles.alphaSliderRail} />
        <div
          class={settingsStyles.alphaSliderFill}
          style={{
            scale: `${alpha() * 100}% 100%`,
          }}
        />
        <div
          class={settingsStyles.alphaSliderThumb}
          style={{
            'translate': 'var(--alpha) 0',
          }}
        />
      </div>
    </div>
  );
};

export default ColorPicker;
