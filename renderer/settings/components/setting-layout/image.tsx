import { splitProps, type JSX } from 'solid-js';

import * as styles from './setting-layout.css';

import { cx } from '../../../utils/classNames';

export type IconImageProps = JSX.ImgHTMLAttributes<HTMLImageElement>;
export type AvatarImageProps = IconImageProps;

export const IconImage = (props: IconImageProps) => {
  const [local, leftProps] = splitProps(props, ['class']);

  return <img {...leftProps} class={cx(styles.iconImage, local.class)} />;
};

export const AvatarImage = (props: AvatarImageProps) => {
  const [local, leftProps] = splitProps(props, ['class']);

  return (
    <IconImage {...leftProps} class={cx(styles.avatarImage, local.class)} />
  );
};
