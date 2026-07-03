import { Trans } from '@jellybrick/solid-i18next';
import { useNavigate } from '@solidjs/router';
import { Button } from '@suis-ui/kit';
import { Marquee } from '@suyongs/solid-utility';
import { Check, ChevronRight, CircleMinus } from 'lucide-solid';
import { Show } from 'solid-js';

import Card from '../../components/Card';
import Switch from '../../components/Switch';
import usePlugins from '../../hooks/usePlugins';
import * as settingsStyles from '../settings.css';

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
        <div class={settingsStyles.cardRow}>
          <Switch
            onChange={togglePluginState}
            value={plugin()?.state === 'enable'}
          />
          <div class={settingsStyles.cardTitle}>
            <Trans key={'setting.plugin.enable-plugin'} />
          </div>
          <div class={settingsStyles.spacer} />
          <Button onClick={refreshPlugin} variant="ghost">
            <Trans key={'setting.plugin.reload'} />
          </Button>
          <Button onClick={onPluginPage} variant="primary">
            <Trans key={'setting.plugin.detail-setting'} />
            <ChevronRight size={18} />
          </Button>
        </div>,
      ]}
    >
      <Show
        fallback={
          <CircleMinus
            class={`${settingsStyles.iconMedium} ${settingsStyles.iconError}`}
          />
        }
        when={plugin()?.state !== 'disable'}
      >
        <Check
          class={`${settingsStyles.iconMedium} ${settingsStyles.iconSuccess}`}
        />
      </Show>
      <div class={settingsStyles.pluginSummary}>
        <div class={settingsStyles.pluginNameLine}>
          {plugin()?.name}
          <span class={settingsStyles.cardCaptionLarge}>
            {' - '}
            {plugin()?.author}
          </span>
        </div>
        <Marquee class={settingsStyles.cardCaptionLarge} gap={18}>
          {plugin()?.description}
        </Marquee>
      </div>
      <div class={settingsStyles.cardCaptionLarge}>
        {plugin()?.version ?? `v${plugin()?.versionCode}`}
      </div>
    </Card>
  );
};

export default PluginCard;
