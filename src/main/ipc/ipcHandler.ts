import { BrowserWindow, dialog, ipcMain } from 'electron';
import Store from 'electron-store';
import {
  CreateDeviceConnectionType,
  DeviceActionEnum,
} from 'types/DeviceTypes';
import { ServerActionEnum } from 'types/ServerTypes';
import { ChannelsEnum } from '../../types/ChannelTypes';
import { ElectronStorageType } from '../../types/ElectronStoreTypes';
import { DEFAULT_SETTINGS, STORAGE_FILE_NAME } from './Constants';
import { createDeviceConnection, stopDeviceSession } from './DeviceOperations';
import { startServer, stopServer } from './ServerOperations';
import getSystemChecks from './SystemChecks';

const store = new Store({
  name: STORAGE_FILE_NAME,
  defaults: { ...DEFAULT_SETTINGS },
});
const getGenericStorage = (): ElectronStorageType => {
  return {
    ...DEFAULT_SETTINGS.generic,
    ...store.get('generic'),
  };
};

function ipcHandler() {
  ipcMain.on(ChannelsEnum.SYSTEM_CHECKS, (event) => {
    event.returnValue = getSystemChecks();
  });
  ipcMain.handle(ChannelsEnum.SELECT_DIRECTORY, async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });

    return result;
  });
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
        portNumber,
        sessionId,
        status,
        storageData,
      }: {
        descriptorId: string;
        manualConnect: boolean;
        portNumber: number;
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
        portNumber,
        sessionId,
        status,
        storageData,
      });

      return result;
    }
  );
}

export { ipcHandler, getGenericStorage, store };
