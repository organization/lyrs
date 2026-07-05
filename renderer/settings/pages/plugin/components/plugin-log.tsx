import { Match, Switch, Show } from 'solid-js';

import * as styles from './plugin-log.css';

import {
  type Plugin,
  type PluginLog as PluginLogType,
} from '../../../../../common/plugins';

export interface PluginLogProps {
  log: PluginLogType;
  showPlugin?: Plugin;
}
const PluginLog = (props: PluginLogProps) => {
  return (
    <div class={styles.pluginLogRoot}>
      <Show when={props.showPlugin}>
        <span class={styles.pluginLogPlugin}>[{props.showPlugin?.name}]</span>
      </Show>
      <span class={styles.pluginLogTime}>
        [{new Date(props.log.time)?.toISOString()}]
      </span>
      <Switch>
        <Match when={props.log.type === 'error'}>
          <span class={styles.pluginLogError}>[ERROR]</span>
        </Match>
        <Match when={props.log.type === 'warn'}>
          <span class={styles.pluginLogWarn}>[WARN]</span>
        </Match>
        <Match when={props.log.type === 'info'}>
          <span class={styles.pluginLogInfo}>[INFO]</span>
        </Match>
        <Match when={props.log.type === 'debug'}>
          <span class={styles.pluginLogDebug}>[DEBUG]</span>
        </Match>
        <Match when={props.log.type === 'log'}>
          <span>[INFO]</span>
        </Match>
      </Switch>
      <span class={styles.pluginLogToken}>{props.log.message}</span>
    </div>
  );
};

export default PluginLog;
