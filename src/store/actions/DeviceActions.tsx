enum DeviceActionTypes {
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
const DEVICE_SESSION_STATUS = {
  CONNECTED: 'CONNECTED',
  CONNECTING: 'CONNECTING',
  ERROR: 'ERROR',
  IDLE: 'IDLE',
  STARTED: 'STARTED',
  STOP: 'STOP',
  STOPPED: 'STOPPED',
  STOPPING: 'STOPPING',
};
const API_STATUS = {
  IDLE: 'IDLE',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  LOADING: 'LOADING',
};

/**
 * Store an error from the device connection
 */
function deviceSessionError(deviceId: string, uint8arr: ArrayBuffer) {
  const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    deviceId,
    log,
    type: DeviceActionTypes.DEVICE_SESSION_ERROR,
  };
}

/**
 * Set the device port number
 */
function deviceSessionStorePort(
  deviceId: string,
  uint8arr: ArrayBuffer,
  port: number
) {
  const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    deviceId,
    log,
    port,
    type: DeviceActionTypes.DEVICE_SESSION_SET_PORT,
  };
}

/**
 * Store the device logs
 */
function deviceSessionStoreLog(deviceId: string, uint8arr: ArrayBuffer) {
  const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    deviceId,
    log,
    type: DeviceActionTypes.DEVICE_SESSION_LOGS,
  };
}

/**
 * Store the ADB connected state
 */
function deviceSessionStoreAdbConnectedStatus(
  deviceId: string,
  connected = false
) {
  return {
    deviceId,
    type: connected
      ? DeviceActionTypes.DEVICE_SESSION_ADB_CONNECTED
      : DeviceActionTypes.DEVICE_SESSION_ADB_DISCONNECTED,
  };
}

/**
 * Start the Device connection
 */
function deviceSessionStart(deviceId: string, uint8arr: ArrayBuffer) {
  const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    deviceId,
    log,
    type: DeviceActionTypes.DEVICE_SESSION_START,
  };
}

/**
 * Stopping the device session
 */
function deviceSessionStopping(
  deviceId: string,
  uint8arr: ArrayBuffer | string
) {
  const log =
    typeof uint8arr === 'string'
      ? uint8arr
      : new TextDecoder('utf-8').decode(uint8arr);

  return {
    deviceId,
    log,
    type: DeviceActionTypes.DEVICE_SESSION_STOPPING,
  };
}

/**
 * Stopped the device session
 */
function deviceSessionStopped(deviceId: string, log: string) {
  return {
    deviceId,
    log,
    type: DeviceActionTypes.DEVICE_SESSION_STOPPED,
  };
}

/**
 * Search for a device
 */
function deviceSearch(searchTerm: string) {
  return {
    searchTerm,
    type: DeviceActionTypes.SEARCH_DEVICES,
  };
}

/**
 * Open our close the device logs
 */
function deviceSessionToggleLogs(deviceId: string, showLogs: boolean) {
  return {
    deviceId,
    showLogs,
    type: DeviceActionTypes.DEVICE_LOG_TOGGLE,
  };
}

/**
 * Clear the device session logs
 */
function deviceSessionClearLogs(deviceId: string) {
  return {
    deviceId,
    type: DeviceActionTypes.DEVICE_SESSION_CLEAR_LOGS,
  };
}

export {
  API_STATUS,
  DeviceActionTypes,
  deviceSearch,
  deviceSessionError,
  deviceSessionClearLogs,
  deviceSessionStart,
  deviceSessionStopped,
  deviceSessionStopping,
  deviceSessionStoreAdbConnectedStatus,
  deviceSessionStoreLog,
  deviceSessionStorePort,
  deviceSessionToggleLogs,
  DEVICE_SESSION_STATUS,
};
