import { Trans, useTransContext } from '@jellybrick/solid-i18next';
import { Box, Button } from '@suis-ui/kit';
import {
  For,
  Show,
  createEffect,
  createSignal,
  onCleanup,
  type JSX,
} from 'solid-js';

import PluginCard from './components/plugin-card';
import PluginLog from './components/plugin-log';

import Card from '../../../components/Card';
import Modal from '../../../components/Modal';
import useConfig from '../../../hooks/useConfig';
import usePlugins from '../../../hooks/usePlugins';
import {
  CardTitle,
  CodeBlock,
  ModalTitle,
  PageRoot,
  PageTitle,
  SectionTitle,
} from '../../components/setting-layout';

export const PluginPage = () => {
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
    <PageRoot>
      <PageTitle>
        <Trans key={'setting.title.plugin'} />
      </PageTitle>
      <SectionTitle>
        <Trans key={'setting.plugin.setting'} />
      </SectionTitle>
      <Card justify="between">
        <Trans key={'setting.plugin.add-plugin'} />
        <label>
          <Button as="span" variant="primary">
            <Trans key={'setting.plugin.add-plugin.from-file'} />
          </Button>
          <input
            accept={'application/zip'}
            hidden
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
            <Box maxH="400px" overflow="yAuto">
              <For each={logs()}>
                {({ plugin, log }) => (
                  <PluginLog log={log} showPlugin={plugin} />
                )}
              </For>
            </Box>,
          ]}
        >
          <Trans key={'setting.plugin.show-log'} />
        </Card>
      </Show>
      <SectionTitle>
        <Trans key={'setting.plugin.loaded-plugin'} />
      </SectionTitle>
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
        <ModalTitle>{t('setting.plugin.load-plugin-failed')}</ModalTitle>
        <CardTitle>
          {error()?.name}
          {': '}
          {error()?.message}
        </CardTitle>
        <CodeBlock>
          <code>{JSON.stringify(error(), null, 2)}</code>
        </CodeBlock>
      </Modal>
    </PageRoot>
  );
};
