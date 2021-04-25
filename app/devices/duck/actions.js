/*
 * action types
 */

export const FETCH_DEVICES_LOADING = 'FETCH_DEVICES_LOADING';
export const FETCH_DEVICES_SUCCESS = 'FETCH_DEVICES_SUCCESS';
export const FETCH_DEVICES_ERROR = 'FETCH_DEVICES_ERROR';
export const FETCH_AVAILABLE_DEVICES_LOADING =
  'FETCH_AVAILABLE_DEVICES_LOADING';
export const FETCH_AVAILABLE_DEVICES_SUCCESS =
  'FETCH_AVAILABLE_DEVICES_SUCCESS';
export const FETCH_AVAILABLE_DEVICES_ERROR = 'FETCH_AVAILABLE_DEVICES_ERROR';
export const SET_TUNNEL_IDENTIFIER = 'SET_TUNNEL_IDENTIFIER';
export const DEVICE_SESSION_START = 'DEVICE_SESSION_START';
export const DEVICE_SESSION_LOGS = 'DEVICE_SESSION_LOGS';
export const GET_DEVICE_SESSIONS = 'GET_DEVICE_SESSIONS';
export const DEVICE_SESSION_CONNECTED = 'DEVICE_SESSION_CONNECTED';
export const DEVICE_SESSION_SET_SESSION = 'DEVICE_SESSION_SET_SESSION';
export const STORE_IN_USE_SESSION = 'STORE_IN_USE_SESSION';
export const DEVICE_SESSION_SET_PORT = 'DEVICE_SESSION_SET_PORT';
export const DEVICE_SESSION_ADB_CONNECTED = 'DEVICE_SESSION_ADB_CONNECTED';
export const DEVICE_SESSION_ADB_DISCONNECTED =
  'DEVICE_SESSION_ADB_DISCONNECTED';
export const DEVICE_SESSION_ERROR = 'DEVICE_SESSION_ERROR';
export const GET_DEVICE_SESSIONS_ERROR = 'GET_DEVICE_SESSIONS_ERROR';
export const SEARCH_DEVICES = 'SEARCH_DEVICES';
export const DEVICE_SESSION_STOP = 'DEVICE_SESSION_STOP';
export const DEVICE_SESSION_STOPPED = 'DEVICE_SESSION_STOPPED';
export const DEVICE_SESSION_STOPPING = 'DEVICE_SESSION_STOPPING';
export const DEVICE_LOG_TOGGLE = 'DEVICE_LOG_TOGGLE';
export const CLEAR_DEVICE_SERVER_LOGS = 'CLEAR_DEVICE_SERVER_LOGS';
export const DEVICE_SESSION_STATUS = {
  CONNECTED: 'CONNECTED',
  CONNECTING: 'CONNECTING',
  ERROR: 'ERROR',
  IDLE: 'IDLE',
  STARTED: 'STARTED',
  STOP: 'STOP',
  STOPPED: 'STOPPED',
  STOPPING: 'STOPPING'
};
export const API_STATUS = {
  IDLE: 'IDLE',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  LOADING: 'LOADING'
};

export function fetchDevicesLoading() {
  return {
    type: FETCH_DEVICES_LOADING,
    status: API_STATUS.LOADING
  };
}

export function fetchDevicesSuccess(devices) {
  return {
    type: FETCH_DEVICES_SUCCESS,
    status: API_STATUS.SUCCESS,
    devices,
    queryResults: devices
  };
}

export function fetchDevicesError(error) {
  return {
    type: FETCH_DEVICES_ERROR,
    status: API_STATUS.ERROR,
    error,
    devices: {}
  };
}

/**
 * Device sessions
 */

/**
 * Log starting the device session
 *
 * @param {string} id the ide of the device
 *
 * @returns {{
 *    id: string,
 *    error: boolean,
 *    type: string,
 *    status: string
 * }}
 */
export function deviceSessionStart(id, uint8arr, manualConnect) {
  const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    error: false,
    id,
    log,
    manualConnect,
    status: DEVICE_SESSION_STATUS.CONNECTING,
    type: DEVICE_SESSION_START
  };
}

/**
 * Log starting the device session
 *
 * @param {string} id the ide of the device
 *
 * @returns {{
 *    id: string,
 *    error: boolean,
 *    type: string,
 *    status: string
 * }}
 */
export function deviceSessionStoreLog(id, uint8arr) {
  const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    error: false,
    id,
    log,
    type: DEVICE_SESSION_LOGS
  };
}

/**
 * Log that there is an error
 *
 * @param {string} id
 * @param {string} uint8arr
 *
 * @returns {{
 *    id: string,
 *    error: boolean,
 *    log: string,
 *    type: string,
 *    status: string
 * }}
 */
export function deviceSessionError(id, uint8arr) {
  const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    error: true,
    id,
    log,
    status: DEVICE_SESSION_STATUS.ERROR,
    type: DEVICE_SESSION_ERROR
  };
}

/**
 * Log that there is an error
 *
 * @param {string} log
 *
 * @returns {{
 *    log: string,
 *    type: string,
 * }}
 */
export function getDeviceSessionsError(log) {
  // const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    log,
    type: GET_DEVICE_SESSIONS_ERROR
  };
}

/**
 * Log that the device is connected
 *
 * @param {string} id
 * @param {string} uint8arr
 *
 * @returns {{
 *    id: string,
 *    log: string,
 *    type: string,
 *    status: string
 * }}
 */
export function deviceSessionConnected(id, uint8arr) {
  const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    id,
    log,
    status: DEVICE_SESSION_STATUS.CONNECTED,
    type: DEVICE_SESSION_CONNECTED
  };
}

/**
 * Store the sessionID to the device
 *
 * @param {string} id
 * @param {string} uint8arr
 * @param {string} sessionID
 *
 * @returns {{
 *    id: string,
 *    log: string,
 *    sessionID: string,
 *    status: string
 *    type: string,
 * }}
 */
export function deviceSessionStoreSession(id, uint8arr, sessionID) {
  const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    id,
    log,
    sessionID,
    manualConnect: true,
    status: DEVICE_SESSION_STATUS.CONNECTED,
    type: DEVICE_SESSION_SET_SESSION
  };
}

/**
 * Set the devices to in Use
 *
 * @param {object} data
 * @param {string} data.deviceDescriptorId
 * @param {string} data.liveViewUrl
 * @param {string} data.name
 * @param {string} data.os
 * @param {string} data.osVersion
 * @param {string} data.sessionId
 *
 * @returns {{
 *    data:{
 *      deviceDescriptorId: string,
 *      liveViewUrl: string,
 *      name: string,
 *      os: string,
 *      osVersion: string,
 *      sessionId: string,
 *    },
 *    type: string,
 * }}
 */
export function storeUsedSession(data) {
  return {
    data,
    type: STORE_IN_USE_SESSION
  };
}

/**
 * Store the port to the device
 *
 * @param {string} id
 * @param {string} uint8arr
 * @param {string} port
 *
 * @returns {{
 *    id: string,
 *    log: string,
 *    port: string,
 *    status: string
 *    type: string,
 * }}
 */
export function deviceSessionStorePort(id, uint8arr, port) {
  const log = new TextDecoder('utf-8').decode(uint8arr);

  return {
    id,
    log,
    port,
    status: DEVICE_SESSION_STATUS.CONNECTED,
    type: DEVICE_SESSION_SET_PORT
  };
}

/**
 * Store that the device is automatically (dis)connected from/to adb
 *
 * @param {string} id
 * @param {boolean} connected
 *
 * @returns {{
 *    id: string,
 *    adbConnected: boolean,
 *    type: string,
 * }}
 */
export function deviceSessionStoreAdbConnectedStatus(id, connected) {
  return {
    id,
    adbConnected: connected,
    type: connected
      ? DEVICE_SESSION_ADB_CONNECTED
      : DEVICE_SESSION_ADB_DISCONNECTED
  };
}

/**
 * Stopping the server
 *
 * @param {string} id
 * @param {string} data
 *
 * @returns {{
 *    id: string,
 *    log: string,
 *    type: string,
 *    status: string
 * }}
 */
export function deviceSessionStopping(id, data) {
  const log =
    typeof data === 'string' ? data : new TextDecoder('utf-8').decode(data);

  return {
    id,
    log,
    status: DEVICE_SESSION_STATUS.STOPPING,
    type: DEVICE_SESSION_STOPPING
  };
}

/**
 * Stopped the server
 *
 * @param {string} id
 * @param {string} code
 *
 * @returns {{
 *    id: string,
 *    log: string,
 *    type: string,
 *    status: string
 * }}
 */
export function deviceSessionStopped(id, code) {
  return {
    id,
    log: `child process exited with code ${code}`,
    status: DEVICE_SESSION_STATUS.STOPPED,
    type: DEVICE_SESSION_STOPPED
  };
}

/**
 * Toggle the device logs
 *
 * @param {string} id
 *
 * @returns {{
 *    id: string,
 *    type: string
 * }}
 */
export function toggleDeviceLogs(id) {
  return {
    id,
    type: DEVICE_LOG_TOGGLE
  };
}

/**
 * Clear the device logs
 *
 * @param {string} id
 *
 * @returns {{
 *    id: string,
 *    type: string
 * }}
 */
export function clearDeviceLogs(id) {
  return {
    id,
    type: CLEAR_DEVICE_SERVER_LOGS
  };
}

/**
 * Search for the devices
 *
 * @param {string} query
 *
 * @returns {{
 *    query: string,
 *    type: string,
 * }}
 */
export function searchDevices(query) {
  return {
    query,
    type: SEARCH_DEVICES
  };
}

/**
 * Set the tunnel identifier
 *
 * @param {string} identifier
 *
 * @returns {{
 *    identifier: string,
 *    type: string
 * }}
 */
export function setTunnelIdentifier(identifier) {
  return {
    type: SET_TUNNEL_IDENTIFIER,
    identifier
  };
}

/**
 * Set the loading status for getting all available devices
 */
export function fetchAvailableDevicesLoading() {
  return {
    type: FETCH_AVAILABLE_DEVICES_LOADING,
    status: API_STATUS.LOADING
  };
}

/**
 * Store all available devices
 * @param {array} devices
 */
export function fetchAvailableDevicesSuccess(devices) {
  return {
    type: FETCH_AVAILABLE_DEVICES_SUCCESS,
    status: API_STATUS.SUCCESS,
    devices
  };
}

/**
 * Store the error if fetching all available devices failed
 */
export function fetchAvailableDevicesError(error) {
  return {
    type: FETCH_AVAILABLE_DEVICES_ERROR,
    status: API_STATUS.ERROR,
    error
  };
}
