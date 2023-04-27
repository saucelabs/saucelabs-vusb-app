import {
  DeviceActionCollectionType,
  DeviceActionEnum,
  DeviceActionType,
  ToggleLogsType,
} from '../../types/DeviceTypes';

/**
 * Store an error from the device connection
 */
function deviceSessionError({
  descriptorId,
  log,
  manualConnect,
}: DeviceActionType) {
  return {
    descriptorId,
    log,
    manualConnect,
    type: DeviceActionEnum.DEVICE_SESSION_ERROR,
  };
}

/**
 * Store the device logs
 */
function deviceSessionRunning({
  adbConnected,
  descriptorId,
  log,
  manualConnect,
  portNumber,
}: DeviceActionType) {
  return {
    adbConnected,
    descriptorId,
    log,
    manualConnect,
    portNumber,
    type: DeviceActionEnum.DEVICE_SESSION_RUNNING,
  };
}

/**
 * Start the Device connection
 */
function deviceSessionStarting({ descriptorId, log }: DeviceActionType) {
  return {
    descriptorId,
    log,
    type: DeviceActionEnum.DEVICE_SESSION_STARTING,
  };
}

/**
 * Stopping the device session
 */
function deviceSessionStopping({ descriptorId, log }: DeviceActionType) {
  return {
    descriptorId,
    log,
    type: DeviceActionEnum.DEVICE_SESSION_STOPPING,
  };
}

/**
 * Stopped the device session
 */
function deviceSessionStopped({
  adbConnected,
  descriptorId,
  log,
  portNumber,
}: DeviceActionType) {
  return {
    adbConnected,
    descriptorId,
    log,
    portNumber,
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
 * Search for a device
 */
function setTunnelIdentifier(tunnelIdentifier: string) {
  return {
    tunnelIdentifier,
    type: DeviceActionEnum.SET_TUNNEL_IDENTIFIER,
  };
}

/**
 * Open our close the device logs
 */
function deviceSessionToggleLogs({ descriptorId, showLogs }: ToggleLogsType) {
  return {
    descriptorId,
    showLogs,
    type: DeviceActionEnum.DEVICE_LOG_TOGGLE,
  };
}

/**
 * Clear the device session logs
 */
function deviceSessionClearLogs(descriptorId: string) {
  return {
    descriptorId,
    type: DeviceActionEnum.DEVICE_SESSION_CLEAR_LOGS,
  };
}

function deviceActions({
  adbConnected,
  descriptorId,
  dispatch,
  logLine: log,
  manualConnect,
  portNumber,
  status,
}: DeviceActionCollectionType) {
  switch (status) {
    case DeviceActionEnum.DEVICE_SESSION_ERROR:
      dispatch(deviceSessionError({ descriptorId, log, manualConnect }));
      break;
    case DeviceActionEnum.DEVICE_SESSION_RUNNING:
      dispatch(
        deviceSessionRunning({
          adbConnected,
          descriptorId,
          log,
          manualConnect,
          portNumber,
        })
      );
      break;
    case DeviceActionEnum.DEVICE_SESSION_STARTING:
      dispatch(deviceSessionStarting({ descriptorId, log }));
      break;
    case DeviceActionEnum.DEVICE_SESSION_STOPPED:
      dispatch(
        deviceSessionStopped({
          adbConnected,
          descriptorId,
          log,
          portNumber,
        })
      );
      break;
    case DeviceActionEnum.DEVICE_SESSION_STOPPING:
      dispatch(deviceSessionStopping({ descriptorId, log }));
      break;
    default:
    // ignore
  }
}

export {
  deviceSearch,
  deviceSessionClearLogs,
  deviceSessionStopped,
  deviceSessionToggleLogs,
  deviceActions,
  setTunnelIdentifier,
};