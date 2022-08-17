/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { join } from 'path';
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Store from 'electron-store';
import fkill from 'fkill';
import { ServerActionEnum } from 'types/ServerTypes';
import { ElectronStorageType } from 'types/ElectronStoreTypes';
import {
  CreateDeviceConnectionType,
  DeviceActionEnum,
} from 'types/DeviceTypes';
import { ChannelsEnum } from '../types/ChannelTypes';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import getSystemChecks from './ipc/SystemChecks';
import { DEFAULT_SETTINGS, STORAGE_FILE_NAME } from './ipc/Constants';
import { startServer, stopServer } from './ipc/ServerOperations';
import {
  stopDeviceSession,
  createDeviceConnection,
} from './ipc/DeviceOperations';
import deviceWindow from './deviceWindow';

// require('@electron/remote/main').initialize();
// require('@electron/remote/main').enable(webContents);

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let splashWindow: BrowserWindow | null = null;

/**
 * @TODO: Improve this in the future
 */
ipcMain.on(ChannelsEnum.SYSTEM_CHECKS, (event) => {
  event.returnValue = getSystemChecks();
});
ipcMain.handle(ChannelsEnum.SELECT_DIRECTORY, async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });

  return result;
});
ipcMain.handle(ChannelsEnum.MAIN_THREAD, () => mainWindow?.reload());
const store = new Store({
  name: STORAGE_FILE_NAME,
  defaults: { ...DEFAULT_SETTINGS },
});
export const getGenericStorage = (): ElectronStorageType => {
  return {
    ...DEFAULT_SETTINGS.generic,
    ...store.get('generic'),
  };
};
ipcMain.on(ChannelsEnum.ELECTRON_STORE_GET, async (event) => {
  event.returnValue = getGenericStorage();
});
ipcMain.on(ChannelsEnum.ELECTRON_STORE_SET, async (_event, value) => {
  store.set('generic', { ...getGenericStorage(), ...value });
});
// For start/stop server
ipcMain.on(
  ChannelsEnum.VUSB_SERVER_START,
  (event: Electron.IpcMainEvent, status: ServerActionEnum) =>
    startServer(event, getGenericStorage(), status)
);
ipcMain.on(ChannelsEnum.VUSB_SERVER_STOP, (event: Electron.IpcMainEvent) =>
  stopServer(event)
);
// For start/stop a vusb connection with a device
ipcMain.handle(
  ChannelsEnum.DEVICE_START,
  async (
    _event,
    {
      descriptorId,
      sessionId,
      storageData,
      tunnelIdentifier,
    }: {
      descriptorId: string;
      sessionId: string | null;
      storageData: ElectronStorageType;
      tunnelIdentifier: string | null;
    }
  ): Promise<CreateDeviceConnectionType> => {
    return createDeviceConnection({
      descriptorId,
      sessionId,
      storageData,
      tunnelIdentifier,
    });
  }
);
ipcMain.handle(
  ChannelsEnum.DEVICE_STOP,
  async (
    _event,
    {
      descriptorId,
      manualConnect,
      port,
      sessionId,
      status,
      storageData,
    }: {
      descriptorId: string;
      manualConnect: boolean;
      port: number;
      sessionId: string;
      status: DeviceActionEnum;
      storageData: ElectronStorageType;
    }
  ): Promise<{
    connectionError: boolean;
    connectionUrl: string;
    logLines: string;
    portNumber: number;
  }> => {
    const result = await stopDeviceSession({
      descriptorId,
      manualConnect,
      port,
      sessionId,
      status,
      storageData,
    });

    return result;
  }
);
// End of ipc's

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  // Fallback to kill the server if it was already running
  try {
    await fkill(`:${getGenericStorage().server.port}`);
    console.log(`

###################################################################################
# There is already a server running, we are now going to kill the running server. #
###################################################################################

`);
  } catch (e) {
    // Server was not running
  }

  const RESOURCES_PATH = app.isPackaged
    ? join(process.resourcesPath, 'assets')
    : join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return join(RESOURCES_PATH, ...paths);
  };

  // Add splash window
  splashWindow = new BrowserWindow({
    width: 300,
    height: 300,
    minWidth: 300,
    minHeight: 300,
    frame: false,
  });
  splashWindow.loadURL(
    `file://${join(__dirname, '..', 'renderer')}/splash.html`
  );
  splashWindow.show();

  mainWindow = new BrowserWindow({
    show: false,
    width: 960,
    minWidth: 960,
    height: 760,
    minHeight: 760,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? join(__dirname, 'preload.js')
        : join(__dirname, '../../.erb/dll/preload.js'),
      webSecurity: false,
    },
  });
  mainWindow.loadURL(resolveHtmlPath('index.html'));
  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      // Hide splashscreen
      splashWindow?.destroy();
      // Show main window
      mainWindow.show();
    }
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser or in a new electron window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes('saucelabs.com/live/mobile/dataCenters/')) {
      deviceWindow({ isDebug, mainWindow, url });

      return { action: 'deny' };
    }

    shell.openExternal(url);

    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);