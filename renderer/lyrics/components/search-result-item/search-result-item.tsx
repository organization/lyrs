import { Trans } from '@jellybrick/solid-i18next';
import { Box, Button, Item, Tooltip } from '@suis-ui/kit';
import { component, token, vars } from '@suis-ui/kit/css';
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
              minW={`calc(${token.size['9']} + ${token.size['3']} + ${vars.size.line.thick})`}
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
              fallback={
                <Check
                  color={vars.color.success.main}
                  size={component.select.check.size}
                />
              }
              when={!props.selected}
            >
              <ChevronRight size={component.select.indicator.size} />
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
        minH={`calc(${token.size['9']} + ${vars.size.space.xs} - ${vars.size.line.md})`}
        onClick={() => props.onSelect(props.item)}
        title={props.item.title}
        variant="secondary"
        w="100%"
      />
    </Tooltip>
  );
};
