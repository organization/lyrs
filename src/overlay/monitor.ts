import { EventEmitter } from 'node:events';

export type ProcMonitorEventEmitter = EventEmitter<{
  'creation': [pid: number, name: string, path: string];
  'deletion': [pid: number, name: string];
}>;

export type ProcessInfo = {
  pid: number;
  name: string;
  path: string;
};

export interface ProcMonitor {
  get event(): ProcMonitorEventEmitter;
  getProcessList(): ProcessInfo[];

  close(): Promise<void>;
}

export async function getProcMonitor(): Promise<ProcMonitor> {
  switch (process.platform) {
    case 'win32': {
      const win32Module = await import('./win32');
      try {
        return await win32Module.Win32ProcMonitor.initialize();
      } catch (e) {
        console.warn(
          '[Lyrs] failed to initialize WQL process monitor. Falling back to snapshot process detection.',
          e,
        );
        return new win32Module.Win32SnapshotProcMonitor();
      }
    }

    default: {
      const event: ProcMonitorEventEmitter = new EventEmitter();
      return {
        event,
        getProcessList() {
          return [];
        },
        async close() {},
      };
    }
  }
}
