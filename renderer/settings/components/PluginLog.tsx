import { Match, Switch, Show } from 'solid-js';

import {
  type Plugin,
  type PluginLog as PluginLogType,
} from '../../../common/plugins';
import * as settingsStyles from '../settings.css';

export interface PluginLogProps {
  log: PluginLogType;
  showPlugin?: Plugin;
}
const PluginLog = (props: PluginLogProps) => {
  return (
    <div class={settingsStyles.pluginLogRoot}>
      <Show when={props.showPlugin}>
        <span class={settingsStyles.pluginLogPlugin}>
          [{props.showPlugin?.name}]
        </span>
      </Show>
      <span class={settingsStyles.pluginLogTime}>
        [{new Date(props.log.time)?.toISOString()}]
      </span>
      <Switch>
        <Match when={props.log.type === 'error'}>
          <span class={settingsStyles.pluginLogError}>
            [ERROR]
          </span>
        </Match>
        <Match when={props.log.type === 'warn'}>
          <span class={settingsStyles.pluginLogWarn}>
            [WARN]
          </span>
        </Match>
        <Match when={props.log.type === 'info'}>
          <span class={settingsStyles.pluginLogInfo}>
            [INFO]
          </span>
        </Match>
        <Match when={props.log.type === 'debug'}>
          <span class={settingsStyles.pluginLogDebug}>
            [DEBUG]
          </span>
        </Match>
        <Match when={props.log.type === 'log'}>
          <span>[INFO]</span>
        </Match>
      </Switch>
      <span class={settingsStyles.pluginLogToken}>
        {props.log.message}
      </span>
    </div>
  );
};

export default PluginLog;
