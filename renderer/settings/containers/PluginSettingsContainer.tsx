import { Trans, useTransContext } from '@jellybrick/solid-i18next';
import { useNavigate, useParams } from '@solidjs/router';
import { Button } from '@suis-ui/kit';
import { Marquee } from '@suyongs/solid-utility';
import { ChevronRight, Info } from 'lucide-solid';
import { For, Switch as SwitchFlow, Match, Show, createSignal } from 'solid-js';

import { type ButtonOption, type SettingOption } from '../../../common/plugins';
import Card from '../../components/Card';
import * as componentStyles from '../../components/components.css';
import Switch from '../../components/Switch';
import useConfig from '../../hooks/useConfig';
import usePlugins from '../../hooks/usePlugins';
import PluginLog from '../components/PluginLog';
import { SettingOptionRenderer } from '../components/SettingOptionRenderer';
import * as settingsStyles from '../settings.css';

const PluginSettingsContainer = () => {
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
    <div class={settingsStyles.pageRoot}>
      <div class={settingsStyles.pageTitleRow}>
        <span class={settingsStyles.pageTitleLink} onClick={onPluginPage}>
          <Trans key={'setting.title.plugin'} />
        </span>
        <ChevronRight class={settingsStyles.iconSmall} />
        <span>{plugin()?.name ?? t('setting.plugin.unknown')}</span>
      </div>
      <Card
        subCards={[
          <div class={settingsStyles.detailList}>
            <For
              each={
                [
                  [
                    t('setting.plugin.id'),
                    plugin()?.id ?? t('setting.plugin.unknown'),
                  ],
                  [
                    t('setting.plugin.name'),
                    plugin()?.name ?? t('setting.plugin.unknown'),
                  ],
                  [
                    t('setting.plugin.description'),
                    plugin()?.description ?? t('setting.plugin.unknown'),
                  ],
                  [
                    t('setting.plugin.author'),
                    plugin()?.author ?? t('setting.plugin.unknown'),
                  ],
                  [
                    t('setting.plugin.version'),
                    plugin()?.version ?? t('setting.plugin.unknown'),
                  ],
                  [
                    t('setting.plugin.version-code'),
                    plugin()?.versionCode ?? t('setting.plugin.unknown'),
                  ],
                  [
                    t('setting.plugin.manifest-version'),
                    plugin()?.manifestVersion ?? t('setting.plugin.unknown'),
                  ],
                  [
                    t('setting.plugin.style-count'),
                    t('setting.plugin.count', {
                      count: plugin()?.css?.length ?? 0,
                    }),
                  ],
                  [
                    t('setting.plugin.include-script'),
                    plugin()?.js
                      ? t('setting.plugin.include')
                      : t('setting.plugin.not-include'),
                  ],
                ] as [string, string][]
              }
            >
              {([key, value]) => (
                <div class={settingsStyles.detailRow}>
                  <div class={settingsStyles.detailKey}>{key}</div>
                  <Marquee class={settingsStyles.detailValue} gap={32}>
                    {value}
                  </Marquee>
                </div>
              )}
            </For>
          </div>,
        ]}
      >
        <Info class={settingsStyles.iconMedium} />
        <div class={settingsStyles.cardTitle}>
          <Trans
            key={'setting.plugin.plugin-info'}
            options={{ name: plugin()?.name }}
          />
        </div>
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
            <div class={settingsStyles.logPanel}>
              <For each={plugin()?.logs}>
                {(log) => <PluginLog log={log} />}
              </For>
            </div>,
          ]}
        >
          <Trans key={'setting.plugin.show-log'} />
        </Card>
      </Show>
      <div class={settingsStyles.sectionTitle}>
        <Trans key={'setting.plugin.setting'} />
      </div>
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
      <div class={settingsStyles.sectionTitle}>
        <Trans key={'setting.plugin.setting'} />
      </div>
      <Card
        justify="between"
        subCards={[
          <div class={settingsStyles.cardRow}>
            <Button
              class={componentStyles.dangerButton}
              onClick={deletePlugin}
              variant="primary"
            >
              <Trans key={'setting.plugin.delete-plugin'} />
            </Button>
          </div>,
        ]}
      >
        <Trans key={'setting.plugin.delete-plugin'} />
      </Card>
    </div>
  );
};

export default PluginSettingsContainer;
