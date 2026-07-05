import { Trans, useTransContext } from '@jellybrick/solid-i18next';
import { useNavigate, useParams } from '@solidjs/router';
import { Button, token } from '@suis-ui/kit';
import { Info } from 'lucide-solid';
import { For, Show, createSignal } from 'solid-js';

import PluginDetailList from './components/plugin-detail-list';

import {
  type ButtonOption,
  type SettingOption,
} from '../../../../../common/plugins';
import { dangerButton } from '../../../../components/button';
import Card from '../../../../components/card';
import { ScrollArea } from '../../../../components/scroll-area';
import Switch from '../../../../components/switch';
import useConfig from '../../../../hooks/useConfig';
import usePlugins from '../../../../hooks/usePlugins';
import {
  CardRow,
  CardTitle,
  iconMediumProps,
  PageBreadcrumb,
  PageRoot,
  SectionTitle,
} from '../../../components/setting-layout';
import { SettingOptionRenderer } from '../../../components/setting-option-renderer';
import PluginLog from '../components/plugin-log';

const LOG_LIST_MAX_HEIGHT = `calc(${token.size['9']} * 4)`;

export const PluginSettingsPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [config, setConfig] = useConfig();
  const [t] = useTransContext();
  const { plugins, broadcast, refresh } = usePlugins();

  const [showLog, setShowLog] = createSignal(false);

  const plugin = () => plugins().find((it) => it.id === params.id);

  const togglePluginState = async () => {
    const newState = plugin()?.state === 'enable' ? 'disable' : 'enable';
    await window.ipcRenderer.invoke('set-plugin-state', params.id!, newState);

    refresh();
  };
  const deletePlugin = async () => {
    await window.ipcRenderer.invoke('remove-plugin', params.id!);
    refresh();
    navigate('/plugin');
  };
  const reloadPlugin = async () => {
    await window.ipcRenderer.invoke('reload-plugin', params.id!);
    refresh();
  };
  const onPluginPage = () => {
    navigate('/plugin');
  };
  const setOption = async (setting: SettingOption, value: unknown) => {
    const id = plugin()?.id;
    if (!id) return;

    await setConfig({
      plugins: { config: { [id]: { [setting.key]: value } } },
    });
  };
  const onButtonClick = (setting: ButtonOption) => {
    broadcast('button-click', setting.key);
  };

  return (
    <PageRoot>
      <PageBreadcrumb
        current={plugin()?.name ?? t('setting.plugin.unknown')}
        onParentClick={onPluginPage}
        parent={<Trans key={'setting.title.plugin'} />}
      />
      <Card subCards={[<PluginDetailList plugin={plugin()} />]}>
        <Info {...iconMediumProps} />
        <CardTitle>
          <Trans
            key={'setting.plugin.plugin-info'}
            options={{ name: plugin()?.name }}
          />
        </CardTitle>
      </Card>
      <Card justify="between">
        <Trans key={'setting.plugin.enable-plugin'} />
        <Switch
          onChange={togglePluginState}
          value={plugin()?.state === 'enable'}
        />
      </Card>
      <Card justify="between">
        <Trans key={'setting.plugin.reload-plugin'} />
        <Button onClick={reloadPlugin} variant="primary">
          <Trans key={'setting.plugin.reload'} />
        </Button>
      </Card>
      <Show when={config()?.developer}>
        <Card
          expand={showLog()}
          justify="between"
          setExpand={setShowLog}
          subCards={[
            <ScrollArea fadeAxes="y" maxH={LOG_LIST_MAX_HEIGHT} overflow="yAuto">
              <For each={plugin()?.logs}>
                {(log) => <PluginLog log={log} />}
              </For>
            </ScrollArea>,
          ]}
        >
          <Trans key={'setting.plugin.show-log'} />
        </Card>
      </Show>
      <SectionTitle>
        <Trans key={'setting.plugin.setting'} />
      </SectionTitle>
      <For each={plugin()?.js?.settings}>
        {(option) => (
          <Card>
            <SettingOptionRenderer
              onChange={(value) => setOption(option, value)}
              onClick={() => onButtonClick(option as ButtonOption)}
              option={option}
              value={config()?.plugins.config[plugin()?.id ?? '']?.[option.key]}
            />
          </Card>
        )}
      </For>
      <SectionTitle>
        <Trans key={'setting.plugin.setting'} />
      </SectionTitle>
      <Card
        justify="between"
        subCards={[
          <CardRow>
            <Button
              class={dangerButton}
              onClick={deletePlugin}
              variant="primary"
            >
              <Trans key={'setting.plugin.delete-plugin'} />
            </Button>
          </CardRow>,
        ]}
      >
        <Trans key={'setting.plugin.delete-plugin'} />
      </Card>
    </PageRoot>
  );
};
