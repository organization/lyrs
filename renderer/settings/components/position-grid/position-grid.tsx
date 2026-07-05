import { splitProps, type JSX } from 'solid-js';

import * as styles from './position-grid.css';

import { cx } from '../../../utils/classNames';

export type PositionGridProps = JSX.HTMLAttributes<HTMLDivElement>;
export type PositionGridIconProps = JSX.ImgHTMLAttributes<HTMLImageElement>;

export const PositionGrid = (props: PositionGridProps) => {
  const [local, leftProps] = splitProps(props, ['class']);

  return <div {...leftProps} class={cx(styles.positionGrid, local.class)} />;
};

export const PositionGridIcon = (props: PositionGridIconProps) => {
  const [local, leftProps] = splitProps(props, ['class']);

  return <img {...leftProps} class={cx(styles.positionIcon, local.class)} />;
};
