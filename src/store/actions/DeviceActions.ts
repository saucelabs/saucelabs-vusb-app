import { DeviceActionEnum } from '../../devices/DeviceTypes';

/**
 * Store an error from the device connection
 */
function deviceSessionError(deviceId: string, log: ArrayBuffer) {
  return {
    deviceId,
    log,
    type: DeviceActionEnum.DEVICE_SESSION_ERROR,
  };
}

/**
 * Set the device port number
 */
function deviceSessionStorePort(
  deviceId: string,
  log: ArrayBuffer,
  port: number
) {
  return {
    deviceId,
    log,
    port,
    type: DeviceActionEnum.DEVICE_SESSION_SET_PORT,
  };
}

/**
 * Store the device logs
 */
function deviceSessionStoreLog(deviceId: string, log: ArrayBuffer) {
  return {
    deviceId,
    log,
    type: DeviceActionEnum.DEVICE_SESSION_LOGS,
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
      ? DeviceActionEnum.DEVICE_SESSION_ADB_CONNECTED
      : DeviceActionEnum.DEVICE_SESSION_ADB_DISCONNECTED,
  };
}

/**
 * Start the Device connection
 */
function deviceSessionStart(deviceId: string, log: ArrayBuffer) {
  return {
    deviceId,
    log,
    type: DeviceActionEnum.DEVICE_SESSION_START,
  };
}

/**
 * Stopping the device session
 */
function deviceSessionStopping(deviceId: string, log: ArrayBuffer | string) {
  return {
    deviceId,
    log,
    type: DeviceActionEnum.DEVICE_SESSION_STOPPING,
  };
}

/**
 * Stopped the device session
 */
function deviceSessionStopped(deviceId: string, log: string) {
  return {
    deviceId,
    log,
    type: DeviceActionEnum.DEVICE_SESSION_STOPPED,
  };
}

/**
 * Search for a device
 */
function deviceSearch(searchTerm: string) {
  return {
    searchTerm,
    type: DeviceActionEnum.SEARCH_DEVICES,
  };
}

/**
 * Open our close the device logs
 */
function deviceSessionToggleLogs(deviceId: string, showLogs: boolean) {
  return {
    deviceId,
    showLogs,
    type: DeviceActionEnum.DEVICE_LOG_TOGGLE,
  };
}

/**
 * Clear the device session logs
 */
function deviceSessionClearLogs(deviceId: string) {
  return {
    deviceId,
    type: DeviceActionEnum.DEVICE_SESSION_CLEAR_LOGS,
  };
}

export {
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
};
