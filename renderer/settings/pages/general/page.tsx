import { Trans, useTransContext } from '@jellybrick/solid-i18next';
import { Box, Button } from '@suis-ui/kit';
import { ExternalLink, FlaskConical } from 'lucide-solid';
import { createResource, createSignal } from 'solid-js';

import { DEFAULT_CONFIG } from '../../../../common/constants';
import { getTranslation } from '../../../../common/intl';
import { type SettingOption } from '../../../../common/plugins';
import Card from '../../../components/Card';
import Modal from '../../../components/Modal';
import Selector from '../../../components/Select';
import Switch from '../../../components/Switch';
import useConfig from '../../../hooks/useConfig';
import { useLyricProvider } from '../../../hooks/useLyricProvider';
import useServer from '../../../hooks/useServer';
import { SettingOptionRenderer } from '../../components/setting-option-renderer';

export const GeneralPage = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const [t, { changeLanguage }] = useTransContext();
  const [config, setConfig] = useConfig();
  const [, restartServer] = useServer();
  const lyricProvider = useLyricProvider();

  const [sourceProviders, setSourceProviders] = createSignal<
    {
      name: string;
      options: SettingOption[];
    }[]
  >([]);
  const [open, setOpen] = createSignal(false);
  const [resetOpen, setResetOpen] = createSignal(false);
  const [resetLastOpen, setResetLastOpen] = createSignal(false);
  const [restartOpen, setRestartOpen] = createSignal(false);
  const [requireOpen, setRequireOpen] = createSignal(false);
  const [lyricProviderList, setLyricProviderList] = createSignal<string[]>([]);

  lyricProvider.list().then(setLyricProviderList);

  const [lyricProviderOptions] = createResource(lyricProvider, () =>
    lyricProvider().getOptions(config()?.language ?? DEFAULT_CONFIG.language),
  );
  const sourceProvider = () =>
    sourceProviders().find((it) => it.name === config()?.sourceProvider);
  const sourceProviderOptions = () => sourceProvider()?.options ?? [];

  const onResetConfig = async () => {
    await window.ipcRenderer.invoke('reset-config');

    setResetLastOpen(false);
    setResetOpen(false);
  };
  const restart = async () => {
    await window.ipcRenderer.invoke('restart-application');
  };

  window.ipcRenderer
    .invoke('get-all-source-providers')
    .then(setSourceProviders);

  return (
    <Box
      align="stretch"
      direction="column"
      flex={1}
      gap="xs"
      justify="flex-start"
      overflow="yAuto"
      py="lg"
    >
      <Box mb="xs" px="lg" text="h1">
        <Trans key={'setting.title.general'} />
      </Box>
      <Box mb="xs" mt="lg" px="lg" text="body">
        <Trans key={'setting.general.general-menu'} />
      </Box>
      <Box align="stretch" direction="column" gap="xs" px="lg">
        <Card justify="between">
          <Box text="body">
            <Trans key={'setting.general.select-language'} />
          </Box>
          <Selector
            format={(str) => getTranslation('language.name', str)}
            minWidth="210px"
            mode={'select'}
            onChange={(value) => {
              setConfig({ language: value });
              changeLanguage(value);
              setOpen(true);
            }}
            options={['ko', 'en', 'ja', 'de']}
            placeholder={t('setting.general.placeholder')}
            value={config()?.language ?? 'ko'}
          />
        </Card>
        <Card justify="between">
          <Box text="body">
            <Trans key={'setting.general.streaming-mode'} />
          </Box>
          <Switch
            onChange={(checked) => setConfig({ streamingMode: checked })}
            value={config()?.streamingMode}
          />
        </Card>
        <Card justify="between">
          <Box text="body">
            <Trans key={'setting.general.app-theme'} />
          </Box>
          <Selector
            format={(str) => t(`setting.general.app-theme.${str}`)}
            minWidth="210px"
            mode={'select'}
            onChange={(value) => {
              setConfig({ appTheme: value });
            }}
            options={['system', 'dark', 'light']}
            placeholder={t('setting.general.placeholder')}
            value={config()?.appTheme}
          />
        </Card>
        <Card
          justify="between"
          subCards={sourceProviderOptions().map((option) => (
            <Box align="center" direction="row" gap="xs" w="100%">
              <SettingOptionRenderer
                onChange={(value) => {
                  setConfig({
                    providers: {
                      ...config()?.providers,
                      source: {
                        ...config()?.providers?.source,
                        config: {
                          ...config()?.providers?.source?.config,
                          [sourceProvider()?.name ?? '']: {
                            ...config()?.providers?.source?.config[
                              sourceProvider()?.name ?? ''
                            ],
                            [option.key]: value,
                          },
                        },
                      },
                    },
                  });
                }}
                option={option}
                value={
                  config()?.providers?.source?.config[
                    sourceProvider()?.name ?? ''
                  ][option.key]
                }
              />
            </Box>
          ))}
        >
          <Box text="body">
            <Trans key={'setting.general.source-provider'} />
          </Box>
          <Box flex={1} />
          <Selector
            format={(str) =>
              t(`setting.general.source-provider.${str}`, {
                defaultValue: str,
              })
            }
            minWidth="210px"
            mode={'select'}
            onChange={(value) => {
              setConfig({ sourceProvider: value });
            }}
            options={sourceProviders().map((it) => it.name)}
            placeholder={t('setting.general.placeholder')}
            value={config()?.sourceProvider}
          />
        </Card>
        <Card
          justify="between"
          subCards={lyricProviderOptions()?.map((option) => (
            <Box align="center" direction="row" gap="xs" w="100%">
              <SettingOptionRenderer
                onChange={(value) => {
                  setConfig({
                    providers: {
                      ...config()?.providers,
                      lyric: {
                        ...config()?.providers?.lyric,
                        config: {
                          ...config()?.providers?.lyric?.config,
                          [lyricProvider()?.name ?? '']: {
                            ...config()?.providers?.lyric?.config[
                              lyricProvider()?.name ?? ''
                            ],
                            [option.key]: value,
                          },
                        },
                      },
                    },
                  });
                }}
                option={option}
                value={
                  config()?.providers?.lyric?.config[
                    lyricProvider()?.name ?? ''
                  ][option.key]
                }
              />
            </Box>
          ))}
        >
          <Box text="body">
            <Trans key={'setting.general.lyric-provider'} />
          </Box>
          <Box flex={1} />
          <Selector
            format={(str) =>
              t(`setting.general.lyric-provider.${str}`, {
                defaultValue: str,
              })
            }
            minWidth="210px"
            mode={'select'}
            onChange={(value) => {
              setConfig({ lyricProvider: value });
            }}
            options={lyricProviderList()}
            placeholder={t('setting.general.placeholder')}
            value={config()?.lyricProvider}
          />
        </Card>
      </Box>
      <Box mb="xs" mt="lg" px="lg" text="body">
        <Trans key={'setting.general.experimental'} />
      </Box>
      <Box align="stretch" direction="column" gap="xs" px="lg">
        <Card justify="between">
          <Box align="flex-start" direction="column" justify="center">
            <Box align="center" direction="row" gap="xs" text="body">
              <Trans key={'setting.general.fix-always-on-top.title'} />
              <FlaskConical opacity="0.5" size={16} />
            </Box>
            <Box c="text.caption" text="caption">
              <Trans key={'setting.general.fix-always-on-top.description'} />
            </Box>
          </Box>
          <Switch
            onChange={(checked) =>
              setConfig({ experimental: { alwaysOnTopFix: checked } })
            }
            value={!!config()?.experimental.alwaysOnTopFix}
          />
        </Card>
      </Box>
      <Box mb="xs" mt="lg" px="lg" text="body">
        <Trans key={'setting.general.developer-menu'} />
      </Box>
      <Box align="stretch" direction="column" gap="xs" px="lg">
        <Card justify="between">
          <Box text="body">
            <Trans key={'setting.general.restart-server'} />
          </Box>
          <Button onClick={restartServer} variant="primary">
            <Trans key={'setting.general.restart'} />
          </Button>
        </Card>
        <Card justify="between">
          <Box text="body">
            <Trans key={'setting.general.restart-program'} />
          </Box>
          <Button onClick={() => setRestartOpen(true)} variant="primary">
            <Trans key={'setting.general.restart'} />
          </Button>
        </Card>
        <Card justify="between">
          <Box text="body">
            <Trans key={'setting.general.hardware-acceleration'} />
          </Box>
          <Box flex={1} />
          <Switch
            onChange={(checked) => {
              setConfig({ hardwareAcceleration: checked });
              setTimeout(() => {
                setRequireOpen(true);
              }, 0);
            }}
            value={config()?.hardwareAcceleration}
          />
        </Card>
        <Card
          expand={config()?.developer}
          justify="between"
          subCards={
            config()?.developer
              ? [
                  <Box
                    align="center"
                    direction="row"
                    h="100%"
                    justify="flex-start"
                    onClick={() =>
                      window.ipcRenderer.invoke('open-devtool', 'lyrics')
                    }
                    w="100%"
                  >
                    <Box text="body">
                      <Trans key={'tray.devtools.lyrics.label'} />
                    </Box>
                    <Box flex={1} />
                    <ExternalLink size={16} />
                  </Box>,
                  <Box
                    align="center"
                    direction="row"
                    h="100%"
                    justify="flex-start"
                    onClick={() =>
                      window.ipcRenderer.invoke('open-devtool', 'settings')
                    }
                    w="100%"
                  >
                    <Box text="body">
                      <Trans key={'tray.devtools.setting.label'} />
                    </Box>
                    <Box flex={1} />
                    <ExternalLink size={16} />
                  </Box>,
                ]
              : undefined
          }
        >
          <Box text="body">
            <Trans key={'setting.general.developer'} />
          </Box>
          <Box flex={1} />
          <Switch
            onChange={(checked) => setConfig({ developer: checked })}
            value={config()?.developer}
          />
        </Card>
      </Box>
      <Box mb="xs" mt="lg" px="lg" text="body">
        <Trans key={'setting.general.dangerous-menu'} />
      </Box>
      <Box align="stretch" direction="column" gap="xs" px="lg">
        <Card justify="between">
          <Box text="body">
            <Trans key={'setting.general.reset-config'} />
          </Box>
          <Button onClick={() => setResetOpen(true)} variant="primary">
            <Trans key={'setting.general.reset'} />
          </Button>
        </Card>
      </Box>
      <Modal
        buttons={[
          {
            type: 'positive',
            name: t('common.close'),
            onClick: () => setRequireOpen(false),
          },
        ]}
        onClose={() => setRequireOpen(false)}
        open={requireOpen()}
      >
        <Box maxW="500px" text="title">
          {t('setting.general.require-alert')}
        </Box>
      </Modal>
      <Modal
        buttons={[
          {
            name: t('common.cancel'),
            onClick: () => setRestartOpen(false),
          },
          {
            type: 'negative',
            name: t('setting.general.restart'),
            onClick: () => {
              setRestartOpen(false);
              restart();
            },
          },
        ]}
        onClose={() => setRestartOpen(false)}
        open={restartOpen()}
      >
        <Box maxW="500px" mb="sm" text="title">
          <Trans key={'setting.general.restart-alert-title'} />
        </Box>
        <Box mb="xs" text="body">
          <Trans key={'setting.general.restart-alert'} />
        </Box>
      </Modal>
      <Modal
        buttons={[
          {
            name: t('common.cancel'),
            onClick: () => setResetOpen(false),
          },
          {
            type: 'negative',
            name: t('setting.general.reset'),
            onClick: () => {
              setResetOpen(false);
              setResetLastOpen(true);
            },
          },
        ]}
        onClose={() => setResetOpen(false)}
        open={resetOpen()}
      >
        <Box maxW="500px" mb="sm" text="title">
          <Trans key={'setting.general.reset-alert-title'} />
        </Box>
        <Box mb="xs" text="body">
          <Trans key={'setting.general.reset-alert'} />
        </Box>
      </Modal>
      <Modal
        buttons={[
          {
            type: 'negative',
            name: t('setting.general.reset'),
            onClick: () => {
              onResetConfig();
            },
          },
          {
            name: t('common.cancel'),
            onClick: () => setResetLastOpen(false),
          },
        ]}
        onClose={() => setResetLastOpen(false)}
        open={resetLastOpen()}
      >
        <Box maxW="500px" mb="sm" text="title">
          <Trans key={'setting.general.reset-alert-title'} />
        </Box>
        <Box mb="xs" text="body">
          <Trans key={'setting.general.reset-last-alert'} />
        </Box>
      </Modal>
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
        <Box text="title">{t('setting.general.language.alert')}</Box>
      </Modal>
    </Box>
  );
};
