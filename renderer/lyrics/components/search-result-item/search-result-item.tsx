import { Trans } from '@jellybrick/solid-i18next';
import { Box, Button, Item, Tooltip } from '@suis-ui/kit';
import { vars } from '@suis-ui/kit/css';
import { Check, ChevronRight } from 'lucide-solid';
import { Show } from 'solid-js';

import { type LyricMetadata } from '../../../../common/provider';
import { formatTime } from '../../../utils/formatTime';

type SearchResultItemProps = {
  item: LyricMetadata;
  onSelect: (item: LyricMetadata) => void | Promise<void>;
  selected: boolean;
};

const formatRegisterDate = (registerDate?: Date) =>
  registerDate
    ? new Date(registerDate).toLocaleString(undefined, {
        dateStyle: 'medium',
        hour12: false,
        timeStyle: 'medium',
      })
    : 'No Date';

export const SearchResultItem = (props: SearchResultItemProps) => {
  const registerDate = () => formatRegisterDate(props.item.registerDate);

  return (
    <Tooltip
      content={`ID: ${props.item.id} · Album: ${props.item.album ?? 'N/A'}`}
      shadow="lg"
    >
      <Item
        action={
          <Box align="center" direction="row" gap="md">
            <Box
              align="flex-end"
              c="text.caption"
              direction="column"
              minW="9rem"
              style={{ 'text-align': 'right' }}
              text="caption"
            >
              <Box>{registerDate()}</Box>
              <Show when={(props.item.playtime ?? 0) > 0}>
                <Box>
                  <Trans key="lyrics.playtime" />:{' '}
                  {formatTime(props.item.playtime ?? 0)}
                </Box>
              </Show>
            </Box>
            <Show
              fallback={<Check color={vars.color.success.main} size="1.6rem" />}
              when={!props.selected}
            >
              <ChevronRight size="1.6rem" />
            </Show>
          </Box>
        }
        active={props.selected}
        as={Button}
        description={
          <Box direction="row" gap="xs" minW="0" wrap="wrap">
            <Box c="text.caption">ID: {props.item.id}</Box>
            <Box c="text.caption">·</Box>
            <Box>{props.item.artist ?? 'N/A'}</Box>
          </Box>
        }
        onClick={() => props.onSelect(props.item)}
        style={{ 'min-height': '67px' }}
        title={props.item.title}
        variant="secondary"
        w="100%"
      />
    </Tooltip>
  );
};
