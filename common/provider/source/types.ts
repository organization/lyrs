import type { ButtonOption, SettingOption } from '../../plugins';
import type { UpdateData } from '../../schema';
import type { EventEmitter } from 'events';

export interface SourceProviderEventMap {
  start: [];
  update: [UpdateData];
  error: [Error];
  close: [];
}

export interface SourceProvider extends EventEmitter<SourceProviderEventMap> {
  name: string;

  start(options: Record<string, unknown>): void;
  close(): void;
  isRunning(): boolean;

  getOptions(language: string): Exclude<SettingOption, ButtonOption>[];
  onOptionChange(options: Record<string, unknown>): void;
}
