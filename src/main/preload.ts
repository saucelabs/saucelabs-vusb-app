import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { ChannelsEnum } from '../types/ChannelTypes';
import { StartDeviceType, StopDeviceType } from '../types/DeviceTypes';
import { ElectronStorageType } from '../types/ElectronStoreTypes';
import { ServerActionEnum } from '../types/ServerTypes';

/**
 * Create a safe, bi-directional communication channel between the renderer and main processes.
 */
contextBridge.exposeInMainWorld('electron', {
  // Reload the app
  reload: async () => ipcRenderer.invoke(ChannelsEnum.MAIN_THREAD),
  // Show a native dialog to access the file system
  showDialog: async () => ipcRenderer.invoke(ChannelsEnum.SELECT_DIRECTORY),
  // Get access to the electron store
  store: {
    get() {
      return ipcRenderer.sendSync(ChannelsEnum.ELECTRON_STORE_GET);
    },
    set(val: ElectronStorageType) {
      ipcRenderer.send(ChannelsEnum.ELECTRON_STORE_SET, val);
    },
  },
  // Get all needed information about the system this app is running on
  systemChecks: {
    once(
      channel: ChannelsEnum.SYSTEM_CHECKS,
      func: (...args: unknown[]) => void
    ) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    get() {
      return ipcRenderer.sendSync(ChannelsEnum.SYSTEM_CHECKS);
    },
  },
  // All vusb server commands
  vusb: {
    start(status: ServerActionEnum) {
      ipcRenderer.send(ChannelsEnum.VUSB_SERVER_START, status);
    },
    onRunning(func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(ChannelsEnum.VUSB_SERVER_START, subscription);
    },
    stop() {
      ipcRenderer.send(ChannelsEnum.VUSB_SERVER_STOP);
    },
    onStopping(func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(ChannelsEnum.VUSB_SERVER_STOP, subscription);
    },
    removeAllListeners() {
      ipcRenderer.removeAllListeners(ChannelsEnum.VUSB_SERVER_START);
      ipcRenderer.removeAllListeners(ChannelsEnum.VUSB_SERVER_STOP);
    },
  },
  // All vusb device commands
  device: {
    start({
      descriptorId,
      sessionId,
      storageData,
      tunnelIdentifier,
    }: StartDeviceType) {
      return ipcRenderer.invoke(ChannelsEnum.DEVICE_START, {
        descriptorId,
        sessionId,
        storageData,
        tunnelIdentifier,
      });
    },
    stop({
      descriptorId,
      manualConnect,
      portNumber,
      sessionId,
      status,
      storageData,
    }: StopDeviceType) {
      return ipcRenderer.invoke(ChannelsEnum.DEVICE_STOP, {
        descriptorId,
        manualConnect,
        portNumber,
        sessionId,
        status,
        storageData,
      });
    },
    onManualSessionClose(func: (...args: unknown[]) => void) {
      ipcRenderer.once(ChannelsEnum.MANUAL_SESSION_CLOSE, (_event, ...args) =>
        func(...args)
      );
    },
  },
});
