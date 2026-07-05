import { useTransContext } from '@jellybrick/solid-i18next';
import { Marquee } from '@suyongs/solid-utility';
import { For } from 'solid-js';

import * as styles from './plugin-detail-list.css';

import type { Plugin } from '../../../../../../common/plugins';

export interface PluginDetailListProps {
  plugin?: Plugin;
}

const PluginDetailList = (props: PluginDetailListProps) => {
  const [t] = useTransContext();
  const rows = () =>
    [
      [t('setting.plugin.id'), props.plugin?.id ?? t('setting.plugin.unknown')],
      [
        t('setting.plugin.name'),
        props.plugin?.name ?? t('setting.plugin.unknown'),
      ],
      [
        t('setting.plugin.description'),
        props.plugin?.description ?? t('setting.plugin.unknown'),
      ],
      [
        t('setting.plugin.author'),
        props.plugin?.author ?? t('setting.plugin.unknown'),
      ],
      [
        t('setting.plugin.version'),
        props.plugin?.version ?? t('setting.plugin.unknown'),
      ],
      [
        t('setting.plugin.version-code'),
        props.plugin?.versionCode ?? t('setting.plugin.unknown'),
      ],
      [
        t('setting.plugin.manifest-version'),
        props.plugin?.manifestVersion ?? t('setting.plugin.unknown'),
      ],
      [
        t('setting.plugin.style-count'),
        t('setting.plugin.count', {
          count: props.plugin?.css?.length ?? 0,
        }),
      ],
      [
        t('setting.plugin.include-script'),
        props.plugin?.js
          ? t('setting.plugin.include')
          : t('setting.plugin.not-include'),
      ],
    ] as [string, string][];

  return (
    <div class={styles.detailList}>
      <For each={rows()}>
        {([key, value]) => (
          <div class={styles.detailRow}>
            <div class={styles.detailKey}>{key}</div>
            <Marquee class={styles.detailValue} gap={32}>
              {value}
            </Marquee>
          </div>
        )}
      </For>
    </div>
  );
};

export default PluginDetailList;
