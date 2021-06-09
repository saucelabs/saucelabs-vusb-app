import { DeviceActionTypes as ACTIONS } from '../store/actions/DeviceActions';

type DeviceStateType = {
  // From the API
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
  // Added extra state
  adbConnected: boolean;
  error: boolean;
  inUse: boolean;
  isBusy: boolean;
  log: string[];
  manualConnect: boolean;
  port: number;
  sessionID: string;
  showDevice: boolean;
  showLogs: boolean;
  status: string;
};
type DevicesStateType = {
  connectedDevices: string[];
  deviceQuery: string;
  devices: DeviceStateType[];
  devicesChecked: boolean;
  error: Error | null;
  status: string;
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
type DevicesActionType =
  | { type: ACTIONS.DEVICE_SESSION_ERROR; deviceId: string; log: string }
  | {
      type: ACTIONS.DEVICE_SESSION_SET_PORT;
      deviceId: string;
      log: string;
      port: number;
    }
  | { type: ACTIONS.DEVICE_SESSION_LOGS; deviceId: string; log: string }
  | { type: ACTIONS.DEVICE_SESSION_ADB_CONNECTED; deviceId: string }
  | { type: ACTIONS.DEVICE_SESSION_ADB_DISCONNECTED; deviceId: string }
  | { type: ACTIONS.DEVICE_SESSION_START; deviceId: string; log: string }
  | { type: ACTIONS.DEVICE_SESSION_STOPPING; deviceId: string; log: string }
  | { type: ACTIONS.DEVICE_SESSION_STOPPED; deviceId: string; log: string }
  | { type: ACTIONS.DEVICE_LOG_TOGGLE; deviceId: string; showLogs: boolean }
  | { type: ACTIONS.DEVICE_SESSION_CLEAR_LOGS; deviceId: string }
  | { type: ACTIONS.FETCH_DEVICES_LOADING }
  | { type: ACTIONS.FETCH_DEVICES_SUCCESS; devices: DeviceStateType[] }
  | { type: ACTIONS.FETCH_DEVICES_ERROR; error: Error }
  | { type: ACTIONS.FETCH_AVAILABLE_DEVICES_LOADING }
  | {
      type: ACTIONS.FETCH_AVAILABLE_DEVICES_SUCCESS;
      availableDevices: string[];
    }
  | { type: ACTIONS.FETCH_AVAILABLE_DEVICES_ERROR; error: Error }
  | { type: ACTIONS.SEARCH_DEVICES; searchTerm: string }
  | { type: ACTIONS.STORE_IN_USE_DEVICES; inUseDevices: InUseDevicesType[] }
  | { type: ACTIONS.IN_USE_DEVICES_ERROR; error: Error };

export {
  DevicesActionType,
  DevicesStateType,
  DeviceStateType,
  InUseDevicesType,
};
