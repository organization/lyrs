import { Trans } from '@jellybrick/solid-i18next';
import { useNavigate } from '@solidjs/router';
import { Box, Button } from '@suis-ui/kit';
import { Marquee } from '@suyongs/solid-utility';
import { Check, ChevronRight, CircleMinus } from 'lucide-solid';
import { Show } from 'solid-js';

import Card from '../../../../components/card';
import Switch from '../../../../components/switch';
import usePlugins from '../../../../hooks/usePlugins';
import {
  CardCaptionLarge,
  CardRow,
  CardSummary,
  CardSummaryLine,
  CardTitle,
  iconErrorProps,
  iconSuccessProps,
  Spacer,
} from '../../../components/setting-layout';

export interface PluginCardProps {
  id: string;
}

const PluginCard = (props: PluginCardProps) => {
  const { plugins, refresh } = usePlugins();
  const navigate = useNavigate();

  const plugin = () => plugins().find((plugin) => plugin.id === props.id);

  const togglePluginState = async () => {
    const target = plugin();
    if (!target) return;

    const newState = target.state === 'enable' ? 'disable' : 'enable';
    await window.ipcRenderer.invoke('set-plugin-state', target.id, newState);
    refresh();

    console.log(plugin());
  };
  const refreshPlugin = async () => {
    const id = plugin()?.id;

    if (typeof id === 'string')
      await window.ipcRenderer.invoke('reload-plugin', id);

    refresh();
  };
  const onPluginPage = () => {
    navigate(`/plugin/${plugin()?.id}`);
  };

  return (
    <Card
      subCards={[
        <CardRow>
          <Switch
            onChange={togglePluginState}
            value={plugin()?.state === 'enable'}
          />
          <CardTitle>
            <Trans key={'setting.plugin.enable-plugin'} />
          </CardTitle>
          <Spacer />
          <Button onClick={refreshPlugin} variant="ghost">
            <Trans key={'setting.plugin.reload'} />
          </Button>
          <Button onClick={onPluginPage} variant="primary">
            <Trans key={'setting.plugin.detail-setting'} />
            <ChevronRight size={18} />
          </Button>
        </CardRow>,
      ]}
    >
      <Show
        fallback={<CircleMinus {...iconErrorProps} />}
        when={plugin()?.state !== 'disable'}
      >
        <Check {...iconSuccessProps} />
      </Show>
      <CardSummary>
        <CardSummaryLine>
          {plugin()?.name}
          <Box as="span" c="text.caption" text="body">
            {' - '}
            {plugin()?.author}
          </Box>
        </CardSummaryLine>
        <CardCaptionLarge>
          <Marquee gap={18}>{plugin()?.description}</Marquee>
        </CardCaptionLarge>
      </CardSummary>
      <CardCaptionLarge>
        {plugin()?.version ?? `v${plugin()?.versionCode}`}
      </CardCaptionLarge>
    </Card>
  );
};

export default PluginCard;
