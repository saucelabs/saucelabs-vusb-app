import {
  DeviceStateInterface,
  InUseDevicesInterface,
} from './DeviceInterfaces';

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
  DEVICE_SESSION_ERROR = 'DEVICE_SESSION_ERROR',
  DEVICE_SESSION_SET_PORT = 'DEVICE_SESSION_SET_PORT',
  DEVICE_SESSION_LOGS = 'DEVICE_SESSION_LOGS',
  DEVICE_SESSION_ADB_CONNECTED = 'DEVICE_SESSION_ADB_CONNECTED',
  DEVICE_SESSION_ADB_DISCONNECTED = 'DEVICE_SESSION_ADB_DISCONNECTED',
  DEVICE_SESSION_START = 'DEVICE_SESSION_START',
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

type DevicesActionType =
  | {
      type: DeviceActionEnum.DEVICE_SESSION_ERROR;
      deviceId: string;
      log: string;
    }
  | {
      type: DeviceActionEnum.DEVICE_SESSION_SET_PORT;
      deviceId: string;
      log: string;
      port: number;
    }
  | {
      type: DeviceActionEnum.DEVICE_SESSION_LOGS;
      deviceId: string;
      log: string;
    }
  | { type: DeviceActionEnum.DEVICE_SESSION_ADB_CONNECTED; deviceId: string }
  | { type: DeviceActionEnum.DEVICE_SESSION_ADB_DISCONNECTED; deviceId: string }
  | {
      type: DeviceActionEnum.DEVICE_SESSION_START;
      deviceId: string;
      log: string;
    }
  | {
      type: DeviceActionEnum.DEVICE_SESSION_STOPPING;
      deviceId: string;
      log: string;
    }
  | {
      type: DeviceActionEnum.DEVICE_SESSION_STOPPED;
      deviceId: string;
      log: string;
    }
  | {
      type: DeviceActionEnum.DEVICE_LOG_TOGGLE;
      deviceId: string;
      showLogs: boolean;
    }
  | { type: DeviceActionEnum.DEVICE_SESSION_CLEAR_LOGS; deviceId: string }
  | { type: DeviceActionEnum.FETCH_DEVICES_LOADING }
  | {
      type: DeviceActionEnum.FETCH_DEVICES_SUCCESS;
      devices: DeviceStateInterface[];
    }
  | { type: DeviceActionEnum.FETCH_DEVICES_ERROR; error: Error }
  | { type: DeviceActionEnum.FETCH_AVAILABLE_DEVICES_LOADING }
  | {
      type: DeviceActionEnum.FETCH_AVAILABLE_DEVICES_SUCCESS;
      availableDevices: string[];
    }
  | { type: DeviceActionEnum.FETCH_AVAILABLE_DEVICES_ERROR; error: Error }
  | { type: DeviceActionEnum.SEARCH_DEVICES; searchTerm: string }
  | {
      type: DeviceActionEnum.STORE_IN_USE_DEVICES;
      inUseDevices: InUseDevicesInterface[];
    }
  | { type: DeviceActionEnum.IN_USE_DEVICES_ERROR; error: Error };

export { DeviceActionEnum, DevicesActionType, DeviceSessionStatusEnum };
