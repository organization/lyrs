import path from 'node:path';

import { type GlasstronOptions } from '@jellybrick/glasstron';
import { app } from 'electron';
import { MicaBrowserWindow } from 'mica-electron';

import { PlatformBrowserWindow } from './platform-browser-window';
import { type WindowProvider } from './types';

import { getTranslation } from '../../common/intl';
import { isWin32, isXfce } from '../../utils/is';
import { getFile } from '../../utils/resource';
import { config } from '../config';

const glassOptions: Partial<GlasstronOptions> = {
  blur: true,
  blurType: isWin32() ? 'acrylic' : 'blurbehind',
  blurGnomeSigma: 100,
  blurCornerRadius: 20,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
};
const micaOptions = {
  show: false,
};
const iconPath = getFile('./assets/icon_square.png');

export class LyricSearchWindowProvider implements WindowProvider {
  public window: Electron.BrowserWindow;

  constructor() {
    this.window = new PlatformBrowserWindow({
      ...(isXfce() ? {} : glassOptions),
      ...micaOptions,
      width: 1000,
      height: 600,
      webPreferences: {
        preload: path.join(import.meta.dirname, '../preload/preload.js'),
        nodeIntegration: true,
      },
      title: getTranslation('title.lyrics', config.get().language),
      titleBarStyle: 'hiddenInset',
      frame: false,
      transparent: !isXfce(),
      vibrancy: 'fullscreen-ui',
      autoHideMenuBar: true,
      icon: iconPath,
    });

    if (this.window instanceof MicaBrowserWindow) {
      this.window.setAutoTheme();
      this.window.setMicaAcrylicEffect();
    }

    if (!app.isPackaged && process.env.ELECTRON_RENDERER_URL) {
      this.window.loadURL(`${process.env.ELECTRON_RENDERER_URL}/lyrics.html`);
    } else {
      this.window.loadFile(
        path.join(import.meta.dirname, '../renderer/lyrics.html'),
      );
    }
  }
}
