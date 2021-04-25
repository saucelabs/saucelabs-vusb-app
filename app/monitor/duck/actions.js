export const VUSB_START = 'VUSB_START';
export const VUSB_STARTING = 'VUSB_STARTING';
export const VUSB_MONITOR_TOGGLE = 'VUSB_MONITOR_TOGGLE';
export const VUSB_RUNNING = 'VUSB_RUNNING';
export const VUSB_ADB_LOG = 'VUSB_ADB_LOG';
export const VUSB_ERROR = 'VUSB_ERROR';
export const VUSB_STOP = 'VUSB_STOP';
export const VUSB_STOPPED = 'VUSB_STOPPED';
export const VUSB_STOPPING = 'VUSB_STOPPING';
export const CLEAR_SERVER_LOGS = 'CLEAR_SERVER_LOGS';
export const VUSB_SERVER_STATUS = {
  ERROR: 'ERROR',
  IDLE: 'IDLE',
  RUNNING: 'RUNNING',
  STOP: 'STOP',
  STARTING: 'STARTING',
  STOPPING: 'STOPPING',
  STOPPED: 'STOPPED'
};

export function vusbServerStart() {
  return {
    type: VUSB_START,
    status: VUSB_SERVER_STATUS.STARTING,
    error: false
  };
}

function vusbServerMonitorToggle() {
  return {
    type: VUSB_MONITOR_TOGGLE
  };
}

function vusbServerClearLogs() {
  return {
    type: CLEAR_SERVER_LOGS,
    clear: true
  };
}

export function vusbServerStarting(uint8arr) {
  const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    type: VUSB_STARTING,
    status: VUSB_SERVER_STATUS.STARTING,
    log
  };
}

export function vusbServerRunning(uint8arr) {
  const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    type: VUSB_RUNNING,
    status: VUSB_SERVER_STATUS.RUNNING,
    log
  };
}

/**
 * Log data about the ADB commands
 *
 * @param {string} uint8arr
 * @returns {
 *  {
 *    log: string,
 *    type: string
 *  }
 * }
 */
export function vusbServerLogAdb(uint8arr) {
  const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    type: VUSB_ADB_LOG,
    log
  };
}

export function vusbServerError(uint8arr) {
  const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    type: VUSB_ERROR,
    status: VUSB_SERVER_STATUS.ERROR,
    error: true,
    log
  };
}

/**
 * Stop the server
 *
 * @param log
 * @returns {{log: *, type: *, apiStatus: *}}
 */
export function vusbServerStop(log) {
  return {
    type: VUSB_STOP,
    apiStatus: VUSB_SERVER_STATUS.STOP,
    log
  };
}

/**
 * Stop the server
 *
 * @param {buffer} uint8arr
 *
 * @returns {{log: *, type: *, apiStatus: *}}
 */
export function vusbServerStopping(uint8arr) {
  const log = uint8arr.toString();

  return {
    type: VUSB_STOPPING,
    apiStatus: VUSB_SERVER_STATUS.STOPPING,
    log
  };
}

/**
 * Stopped the server
 *
 * @param {string} uint8arr
 *
 * @returns {{log: string, type: *, apiStatus: *}}
 */
export function vusbServerStopped(uint8arr) {
  const log = uint8arr
    ? new TextDecoder('utf-8').decode(uint8arr)
    : 'Server stopped';

  return {
    type: VUSB_STOPPED,
    apiStatus: VUSB_SERVER_STATUS.STOPPED,
    log
  };
}

export function toggleVusbServerMonitor() {
  return (dispatch) => dispatch(vusbServerMonitorToggle());
}

export function clearVusbServerLogs() {
  return (dispatch) => dispatch(vusbServerClearLogs());
}
