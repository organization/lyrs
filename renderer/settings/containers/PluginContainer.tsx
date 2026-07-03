import { Trans, useTransContext } from '@jellybrick/solid-i18next';
import { Button } from '@suis-ui/kit';
import {
  For,
  Show,
  createEffect,
  createSignal,
  onCleanup,
  type JSX,
} from 'solid-js';

import Card from '../../components/Card';
import Modal from '../../components/Modal';
import useConfig from '../../hooks/useConfig';
import usePlugins from '../../hooks/usePlugins';
import PluginCard from '../components/PluginCard';
import PluginLog from '../components/PluginLog';
import * as settingsStyles from '../settings.css';

const PluginContainer = () => {
  const [t] = useTransContext();
  const { plugins, refresh } = usePlugins();
  const [config] = useConfig();

  const [open, setOpen] = createSignal(false);
  const [showLog, setShowLog] = createSignal(false);
  const [error, setError] = createSignal<Error | null>(null);

  const pluginIdList = () => plugins().map((plugin) => plugin.id);
  const logs = () =>
    plugins()
      .flatMap((plugin) => plugin.logs.map((log) => ({ plugin, log })))
      .sort((a, b) => a.log.time - b.log.time);

  let refreshPlugin: NodeJS.Timeout | null = null;
  createEffect(() => {
    if (refreshPlugin) clearInterval(refreshPlugin);

    if (showLog()) {
      refresh();

      refreshPlugin = setInterval(() => {
        refresh();
      }, 1000);
    }
  });
  onCleanup(() => {
    if (refreshPlugin) clearInterval(refreshPlugin);
  });

  const onAddPlugin: JSX.InputEventHandlerUnion<
    HTMLInputElement,
    InputEvent
  > = async (event) => {
    const file = event.target.files?.item(0);
    if (!file) {
      setOpen(true);
      setError(new Error('No file selected'));
      return;
    }

    const error = await window.ipcRenderer.invoke(
      'add-plugin',
      window.getPathForFile(file),
    );

    if (error) {
      setOpen(true);
      setError(error);
    }

    refresh();
  };
  const reloadPlugins = async () => {
    await Promise.all(
      pluginIdList().map((id) =>
        window.ipcRenderer.invoke('reload-plugin', id),
      ),
    );

    refresh();
  };

  return (
    <div class={settingsStyles.pageRoot}>
      <div class={settingsStyles.pageTitle}>
        <Trans key={'setting.title.plugin'} />
      </div>
      <div class={settingsStyles.sectionTitle}>
        <Trans key={'setting.plugin.setting'} />
      </div>
      <Card justify="between">
        <Trans key={'setting.plugin.add-plugin'} />
        <label>
          <Button as="span" variant="primary">
            <Trans key={'setting.plugin.add-plugin.from-file'} />
          </Button>
          <input
            accept={'application/zip'}
            class={settingsStyles.hiddenInput}
            id={'plugin'}
            onInput={onAddPlugin}
            type={'file'}
          />
        </label>
      </Card>
      <Card justify="between">
        <Trans key={'setting.plugin.reload-all-plugins'} />
        <Button onClick={reloadPlugins} variant="primary">
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
              <For each={logs()}>
                {({ plugin, log }) => (
                  <PluginLog log={log} showPlugin={plugin} />
                )}
              </For>
            </div>,
          ]}
        >
          <Trans key={'setting.plugin.show-log'} />
        </Card>
      </Show>
      <div class={settingsStyles.sectionTitle}>
        <Trans key={'setting.plugin.loaded-plugin'} />
      </div>
      <For each={pluginIdList()}>{(id) => <PluginCard id={id} />}</For>
      <Modal
        buttons={[
          {
            type: 'positive',
            name: t('common.okay'),
            onClick: () => setOpen(false),
          },
        ]}
        onClose={() => setOpen(false)}
        open={open()}
      >
        <div class={settingsStyles.modalTitle}>
          {t('setting.plugin.load-plugin-failed')}
        </div>
        <div class={settingsStyles.cardTitle}>
          {error()?.name}
          {': '}
          {error()?.message}
        </div>
        <pre class={settingsStyles.codeBlock}>
          <code>{JSON.stringify(error(), null, 2)}</code>
        </pre>
      </Modal>
    </div>
  );
};

export default PluginContainer;
