import {
  type Plugin,
  type PluginLog,
  type PluginLogType,
  type PluginLogger,
} from '../../../common/plugins';

export const createLogExecutor = <Type extends PluginLogType>(
  plugin: Plugin,
  type: Type,
): PluginLogger[Type] => {
  return (...args) => {
    const log: PluginLog = {
      type,
      time: Date.now(),
      message: args
        .map((arg) =>
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg),
        )
        .join(' '),
      metadata: args.filter((arg) => typeof arg === 'object'),
    };

    console.log('[Lyrs] [Plugin]', log);
    plugin.logs.push(log);
  };
};

export const createLogger = (plugin: Plugin): PluginLogger => {
  return {
    log: createLogExecutor(plugin, 'log'),
    error: createLogExecutor(plugin, 'error'),
    warn: createLogExecutor(plugin, 'warn'),
    info: createLogExecutor(plugin, 'info'),
    debug: createLogExecutor(plugin, 'debug'),
  };
};
