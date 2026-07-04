import type { JSX } from 'solid-js';
import { Box } from '@suis-ui/kit';
import CircleQuestionMark from 'lucide-solid/icons/circle-question-mark';
import TriangleAlert from 'lucide-solid/icons/triangle-alert';

export type EmptyProps = {
  type?: 'default' | 'error';
  media?: JSX.Element;
  title?: string;
  description?: string;

  children?: JSX.Element;
}
export const Empty = (props: EmptyProps) => {
  const media = () => {
    if (props.media) return props.media;

    return props.type === 'error' ? <TriangleAlert /> : <CircleQuestionMark />;
  }

  return (
    <Box
      flex
      w={'100%'}
      h={'100%'}
      direction={'column'}
      align={'center'}
      justify={'center'}
      gap={'lg'}
      py={'xxl'}
    >
      <Box
        bg={props.type === 'error' ? 'error.container' : 'surface.high'}
        c={props.type === 'error' ? 'error.main' : 'surface.contrast'}
        p={'lg'}
        r={'lg'}
      >
        {media()}
      </Box>
      <Box
        justify={'flex-start'}
        align={'center'}
        gap={'sm'}
      >
        <Box
          text={'title'}
          c={props.type === 'error' ? 'error.main' : 'surface.contrast'}
        >
          {props.title}
        </Box>
        <Box
          text={'caption'}
          c={props.type === 'error' ? 'error.main' : 'surface.contrast'}
          style={{ opacity: 0.5 }}
        >
          {props.description}
        </Box>
      </Box>
      {props.children}
    </Box>
  );
};