import { ServerActionEnum } from '../../server/ServerTypes';

/**
 * Trigger the server to start
 */
function vusbServerStartAction(log: ArrayBuffer) {
  return {
    log,
    type: ServerActionEnum.VUSB_START,
  };
}

/**
 * The server is starting up
 */
function vusbServerStartingAction(log: ArrayBuffer) {
  return {
    log,
    type: ServerActionEnum.VUSB_STARTING,
  };
}

/**
 * The server is running
 */
function vusbServerRunningAction(log: ArrayBuffer) {
  return {
    log,
    type: ServerActionEnum.VUSB_RUNNING,
  };
}

/**
 * There was an error with the server
 */
function vusbServerErrorAction(log: ArrayBuffer) {
  return {
    log,
    type: ServerActionEnum.VUSB_ERROR,
  };
}

/**
 * The server was asked to stop
 */
function vusbServerStopAction(log: ArrayBuffer) {
  return {
    log,
    type: ServerActionEnum.VUSB_STOP,
  };
}

/**
 * The server is stopping
 */
function vusbServerStoppingAction(log: ArrayBuffer) {
  return {
    log,
    type: ServerActionEnum.VUSB_STOPPING,
  };
}

/**
 * The server stopped
 */
function vusbServerStoppedAction(log: ArrayBuffer) {
  return {
    log,
    type: ServerActionEnum.VUSB_STOPPED,
  };
}

/**
 * The server is back to idle
 */
function vusbServerIdleAction(log: ArrayBuffer) {
  return {
    log,
    type: ServerActionEnum.VUSB_IDLE,
  };
}

/**
 * Show or hide the vUSB server monitor
 */
function vusbServerMonitorToggleAction() {
  return {
    type: ServerActionEnum.VUSB_MONITOR_TOGGLE,
  };
}

/**
 * Clear the logs
 */
function vusbServerClearLogsAction() {
  return {
    type: ServerActionEnum.CLEAR_SERVER_LOGS,
  };
}

/**
 * Log data about the ADB commands
 */
function vusbServerLogAdbAction(log: ArrayBuffer) {
  return {
    log,
    type: ServerActionEnum.VUSB_ADB_LOG,
  };
}

export {
  vusbServerClearLogsAction,
  vusbServerErrorAction,
  vusbServerIdleAction,
  vusbServerLogAdbAction,
  vusbServerMonitorToggleAction,
  vusbServerRunningAction,
  vusbServerStartAction,
  vusbServerStartingAction,
  vusbServerStopAction,
  vusbServerStoppedAction,
  vusbServerStoppingAction,
};
