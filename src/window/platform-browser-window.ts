import { BrowserWindow as GlassBrowserWindow } from '@jellybrick/glasstron';
import { BrowserWindow } from 'electron';
import { IS_WINDOWS_11, MicaBrowserWindow } from 'mica-electron';

import { isWin32, isXfce } from '../../utils/is';

const resolvePlatformBrowserWindow = () => {
  if (isWin32() && IS_WINDOWS_11) return MicaBrowserWindow;
  if (isXfce()) return BrowserWindow;
  return GlassBrowserWindow;
};

export const PlatformBrowserWindow = resolvePlatformBrowserWindow();
