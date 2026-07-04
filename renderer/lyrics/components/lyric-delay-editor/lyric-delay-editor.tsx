import { Trans, useTransContext } from '@jellybrick/solid-i18next';
import { Box, Input } from '@suis-ui/kit';

import { Slider } from '../../../components/Slider';

type LyricDelayEditorProps = {
  onChange: (value: number) => void;
  value: () => number;
};

export const LyricDelayEditor = (props: LyricDelayEditorProps) => {
  const [t] = useTransContext();

  return (
    <Box align="stretch" direction="column" gap="md" w="100%">
      <Box
        align="center"
        direction="row"
        gap="md"
        justify="space-between"
        w="100%"
      >
        <Trans key="lyrics.delay" />
        <Box align="center" direction="row" gap="xs">
          <Input
            onChange={(event) => {
              props.onChange(~~(event.currentTarget.valueAsNumber ?? 0));
            }}
            type="number"
            value={props.value()}
            w="20ch"
          />
          <Box text="caption">ms</Box>
        </Box>
      </Box>
      <Slider
        label={[
          { label: t('lyrics.delay.slowly'), value: -3000 },
          { label: t('lyrics.delay.default'), value: 0 },
          { label: t('lyrics.delay.fastly'), value: 3000 },
        ]}
        max={3000}
        min={-3000}
        onChange={props.onChange}
        step={100}
        value={props.value()}
        width="100%"
      />
    </Box>
  );
};
