import { AxiosError } from 'axios';
import { ElectronStorageType } from './ElectronStoreTypes';
import { DispatchType } from './GenericTypes';

enum ApiStatusEnum {
  IDLE = 'IDLE',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  LOADING = 'LOADING',
}
enum DeviceActionEnum {
  FETCH_DEVICES_LOADING = 'FETCH_DEVICES_LOADING',
  FETCH_DEVICES_SUCCESS = 'FETCH_DEVICES_SUCCESS',
  FETCH_DEVICES_ERROR = 'FETCH_DEVICES_ERROR',
  FETCH_AVAILABLE_DEVICES_LOADING = 'FETCH_AVAILABLE_DEVICES_LOADING',
  FETCH_AVAILABLE_DEVICES_SUCCESS = 'FETCH_AVAILABLE_DEVICES_SUCCESS',
  FETCH_AVAILABLE_DEVICES_ERROR = 'FETCH_AVAILABLE_DEVICES_ERROR',
  STORE_IN_USE_DEVICES = 'STORE_IN_USE_DEVICES',
  IN_USE_DEVICES_ERROR = 'IN_USE_DEVICES_ERROR',
  SEARCH_DEVICES = 'SEARCH_DEVICES',
  SET_TUNNEL_IDENTIFIER = 'SET_TUNNEL_IDENTIFIER',
  DEVICE_SESSION_ERROR = 'DEVICE_SESSION_ERROR',
  DEVICE_SESSION_RUNNING = 'DEVICE_SESSION_RUNNING',
  DEVICE_SESSION_STARTING = 'DEVICE_SESSION_STARTING',
  DEVICE_SESSION_STOPPING = 'DEVICE_SESSION_STOPPING',
  DEVICE_SESSION_STOPPED = 'DEVICE_SESSION_STOPPED',
  DEVICE_LOG_TOGGLE = 'DEVICE_LOG_TOGGLE',
  DEVICE_SESSION_CLEAR_LOGS = 'DEVICE_SESSION_CLEAR_LOGS',
}
enum DeviceSessionStatusEnum {
  CONNECTED = 'CONNECTED',
  CONNECTING = 'CONNECTING',
  ERROR = 'ERROR',
  IDLE = 'IDLE',
  STARTED = 'STARTED',
  STOP = 'STOP',
  STOPPED = 'STOPPED',
  STOPPING = 'STOPPING',
}

type DevicesApiType = {
  abiType: string;
  apiLevel: number;
  cloudType: string;
  compositeId: string;
  connectivity: string[];
  cpuCores: number;
  cpuFrequency: number;
  cpuType: string;
  dataCenterId: string;
  descriptorId: string;
  dpi: number;
  dpiName: string;
  formFactor: string;
  freeOfCharge: false;
  hasOnScreenButtons: true;
  includedInPlan: true;
  internalStorageSize: number;
  manufacturers: string[];
  modelNumber: string;
  name: string;
  os: string;
  osVersion: string;
  phoneNumber: null;
  ramSize: number;
  resolutionHeight: number;
  resolutionWidth: number;
  screenSize: number;
  supportsAppiumWebAppTesting: boolean;
};
type ExtraDeviceStateType = {
  adbConnected: boolean;
  dc: string;
  error: boolean;
  inUse: boolean;
  isBusy: boolean;
  log: string[];
  manualConnect: boolean;
  portNumber: number;
  sessionID: string;
  showDevice: boolean;
  showLogs: boolean;
  status: string;
};
type DeviceStateType = DevicesApiType & ExtraDeviceStateType;
type DevicesStateType = {
  connectedDevices: string[];
  deviceQuery: string;
  devices: DeviceStateType[];
  devicesChecked: boolean;
  error: AxiosError | null;
  status: ApiStatusEnum;
  tunnelIdentifier: string | null;
};
type InUseDevicesType = {
  deviceDescriptorId: string;
  liveViewUrl: string;
  name: string;
  os: string;
  osVersion: string;
  sessionId: string;
  virtualUsbRouterUrl: string;
};
type StartDeviceType = {
  descriptorId: string;
  sessionId: string | null;
  storageData: ElectronStorageType;
  tunnelIdentifier: string | null;
};
type StopDeviceType = {
  descriptorId: string;
  manualConnect: boolean;
  portNumber: number;
  sessionId: string;
  status: string;
  storageData: ElectronStorageType;
};
type CreateDeviceConnectionType = {
  adbConnected: boolean;
  connectionError: boolean;
  connectionUrl: string;
  logLines: string;
  manualConnect: boolean;
  portNumber: number;
  sessionId: string;
};
type DeviceActionType = {
  adbConnected?: boolean;
  descriptorId: string;
  log: string;
  manualConnect?: boolean;
  portNumber?: number;
};
type DevicesActionType =
  | {
      type: DeviceActionEnum.DEVICE_SESSION_ERROR;
      descriptorId: string;
      log: string;
      manualConnect: boolean;
    }
  | {
      type: DeviceActionEnum.DEVICE_SESSION_RUNNING;
      adbConnected: boolean;
      descriptorId: string;
      log: string;
      manualConnect: boolean;
      portNumber: number;
    }
  | {
      type: DeviceActionEnum.DEVICE_SESSION_STARTING;
      descriptorId: string;
      log: string;
    }
  | {
      type: DeviceActionEnum.DEVICE_SESSION_STOPPING;
      descriptorId: string;
      log: string;
    }
  | {
      type: DeviceActionEnum.DEVICE_SESSION_STOPPED;
      adbConnected: boolean;
      descriptorId: string;
      log: string;
      portNumber: number;
    }
  | {
      type: DeviceActionEnum.DEVICE_LOG_TOGGLE;
      descriptorId: string;
      showLogs: boolean;
    }
  | { type: DeviceActionEnum.DEVICE_SESSION_CLEAR_LOGS; descriptorId: string }
  | { type: DeviceActionEnum.FETCH_DEVICES_LOADING }
  | {
      type: DeviceActionEnum.FETCH_DEVICES_SUCCESS;
      devices: DeviceStateType[];
    }
  | { type: DeviceActionEnum.FETCH_DEVICES_ERROR; error: AxiosError }
  | { type: DeviceActionEnum.FETCH_AVAILABLE_DEVICES_LOADING }
  | {
      type: DeviceActionEnum.FETCH_AVAILABLE_DEVICES_SUCCESS;
      availableDevices: string[];
    }
  | { type: DeviceActionEnum.FETCH_AVAILABLE_DEVICES_ERROR; error: AxiosError }
  | { type: DeviceActionEnum.SEARCH_DEVICES; searchTerm: string }
  | { type: DeviceActionEnum.SET_TUNNEL_IDENTIFIER; tunnelIdentifier: string }
  | {
      type: DeviceActionEnum.STORE_IN_USE_DEVICES;
      inUseDevices: InUseDevicesType[];
    }
  | { type: DeviceActionEnum.IN_USE_DEVICES_ERROR; error: AxiosError };
type DeviceActionCollectionType = {
  adbConnected?: boolean;
  descriptorId: string;
  dispatch: DispatchType;
  logLine: string;
  manualConnect?: boolean;
  portNumber?: number;
  status: DeviceActionEnum;
};
type ToggleLogsType = {
  descriptorId: string;
  showLogs: boolean;
};
type StartStopAdbConnectionType = {
  descriptorId: string;
  logsPath: string;
  logsToFile: boolean;
  portNumber: number;
};
type ConnectToDeviceType = {
  descriptorId: string;
  sessionId: string;
  storageData: ElectronStorageType;
};
type StartDeviceConnection = {
  descriptorId: string;
  storageData: ElectronStorageType;
  tunnelIdentifier: string | null;
};

export {
  CreateDeviceConnectionType,
  ConnectToDeviceType,
  DeviceActionCollectionType,
  DeviceActionEnum,
  DeviceActionType,
  DevicesActionType,
  DeviceSessionStatusEnum,
  DevicesStateType,
  DeviceStateType,
  ExtraDeviceStateType,
  InUseDevicesType,
  StartDeviceType,
  StartDeviceConnection,
  StartStopAdbConnectionType,
  StopDeviceType,
  ToggleLogsType,
};
