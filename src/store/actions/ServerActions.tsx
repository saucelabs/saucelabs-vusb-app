const VUSB_SERVER_STATUS = {
  ERROR: 'ERROR',
  IDLE: 'IDLE',
  RUNNING: 'RUNNING',
  STOP: 'STOP',
  STARTING: 'STARTING',
  STARTED: 'STARTED',
  STOPPING: 'STOPPING',
  STOPPED: 'STOPPED',
};
enum ServerActionTypes {
  VUSB_START = 'VUSB_START',
  VUSB_STARTING = 'VUSB_STARTING',
  VUSB_RUNNING = 'VUSB_RUNNING',
  VUSB_MONITOR_TOGGLE = 'VUSB_MONITOR_TOGGLE',
  VUSB_ADB_LOG = 'VUSB_ADB_LOG',
  VUSB_ERROR = 'VUSB_ERROR',
  VUSB_STOP = 'VUSB_STOP',
  VUSB_STOPPING = 'VUSB_STOPPING',
  VUSB_STOPPED = 'VUSB_STOPPED',
  VUSB_IDLE = 'VUSB_IDLE',
  CLEAR_SERVER_LOGS = 'CLEAR_SERVER_LOGS',
}

/**
 * Trigger the server to start
 */
function vusbServerStartAction(uint8arr: ArrayBuffer) {
  const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    type: ServerActionTypes.VUSB_START,
    log,
  };
}

/**
 * The server is starting up
 */
function vusbServerStartingAction(uint8arr: ArrayBuffer) {
  const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    type: ServerActionTypes.VUSB_STARTING,
    log,
  };
}

/**
 * The server is running
 */
function vusbServerRunningAction(uint8arr: ArrayBuffer) {
  const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    type: ServerActionTypes.VUSB_RUNNING,
    log,
  };
}

/**
 * There was an error with the server
 */
function vusbServerErrorAction(uint8arr: ArrayBuffer) {
  const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    type: ServerActionTypes.VUSB_ERROR,
    log,
  };
}

/**
 * The server was asked to stop
 */
function vusbServerStopAction(uint8arr: ArrayBuffer) {
  const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    type: ServerActionTypes.VUSB_STOP,
    log,
  };
}

/**
 * The server is stopping
 */
function vusbServerStoppingAction(uint8arr: ArrayBuffer) {
  const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    type: ServerActionTypes.VUSB_STOPPING,
    log,
  };
}

/**
 * The server stopped
 */
function vusbServerStoppedAction(uint8arr: ArrayBuffer) {
  const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    type: ServerActionTypes.VUSB_STOPPED,
    log,
  };
}

/**
 * The server is back to idle
 */
function vusbServerIdleAction(uint8arr: ArrayBuffer) {
  const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    type: ServerActionTypes.VUSB_IDLE,
    log,
  };
}

/**
 * Show or hide the vUSB server monitor
 */
function vusbServerMonitorToggleAction() {
  return {
    type: ServerActionTypes.VUSB_MONITOR_TOGGLE,
  };
}

/**
 * Clear the logs
 */
function vusbServerClearLogsAction() {
  return {
    type: ServerActionTypes.CLEAR_SERVER_LOGS,
  };
}

/**
 * Log data about the ADB commands
 */
function vusbServerLogAdbAction(uint8arr: ArrayBuffer) {
  const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    type: ServerActionTypes.VUSB_ADB_LOG,
    log,
  };
}

export {
  ServerActionTypes,
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
  VUSB_SERVER_STATUS,
};
