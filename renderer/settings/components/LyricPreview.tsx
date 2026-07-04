import { Trans, useTransContext } from '@jellybrick/solid-i18next';
import {
  createSignal,
  onCleanup,
  onMount,
  untrack,
  type JSX,
  splitProps,
} from 'solid-js';

import Card from '../../components/Card';
import UserCSS from '../../components/UserCSS';
import useConfig from '../../hooks/useConfig';
import LyricProgressBar from '../../main/components/LyricProgressBar';
import { useLyricsStyle } from '../../main/components/Lyrics';
import LyricsTransition from '../../main/components/LyricsTransition';
import { cx } from '../../utils/classNames';
import { userCSSTransitions } from '../../utils/userCSSSelectors';
import * as settingsStyles from '../settings.css';

import type { StyleConfig } from '../../../common/schema';

export interface LyricPreviewProps extends JSX.HTMLAttributes<HTMLDivElement> {
  theme: StyleConfig;
}

const LyricPreview = (props: LyricPreviewProps) => {
  const [local, leftProps] = splitProps(props, ['theme']);
  const [t] = useTransContext();
  const [config] = useConfig();

  const PREVIEW_TEXT_A = [
    t('setting.theme.animation.preview-text-a.0'),
    t('setting.theme.animation.preview-text-a.1'),
    t('setting.theme.animation.preview-text-a.2'),
  ];

  const PREVIEW_TEXT_B = [
    t('setting.theme.animation.preview-text-b.0'),
    t('setting.theme.animation.preview-text-b.1'),
    t('setting.theme.animation.preview-text-b.2'),
  ];

  const [animationPreview, setAnimationPreview] = createSignal(PREVIEW_TEXT_A);

  const animation = () => {
    const configuredName = props.theme?.animation ?? 'pretty';
    if (configuredName === 'custom') {
      return userCSSTransitions['transition-lyric'];
    }

    return `lyric-${configuredName}`;
  };

  let interval: number | null = null;
  onMount(() => {
    let isTick = false;
    interval = window.setInterval(() => {
      const nextPreview = untrack(() =>
        isTick ? PREVIEW_TEXT_A : PREVIEW_TEXT_B,
      );

      isTick = !isTick;
      setAnimationPreview(nextPreview);
    }, 1500);
  });

  onCleanup(() => {
    if (typeof interval === 'number') clearInterval(interval);
  });

  useLyricsStyle(() => props.theme, config);

  return (
    <Card
      {...leftProps}
      class={cx(settingsStyles.previewCard, leftProps.class)}
      subCards={[
        <>
          <LyricProgressBar theme={props.theme} />
          <UserCSS theme={props.theme} />
        </>,
        <LyricsTransition
          animation={animation()}
          class={settingsStyles.previewTransition}
          lyrics={animationPreview()}
          status={'playing'}
          style={`row-gap: ${local.theme.lyric.containerRowGap}rem;`}
        />,
      ]}
    >
      <Trans key={'setting.theme.preview'} />
    </Card>
  );
};

export default LyricPreview;
