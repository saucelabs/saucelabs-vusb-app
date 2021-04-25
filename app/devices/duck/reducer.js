import {
  FETCH_DEVICES_ERROR,
  FETCH_DEVICES_LOADING,
  FETCH_DEVICES_SUCCESS,
  DEVICE_SESSION_CONNECTED,
  DEVICE_SESSION_ERROR,
  DEVICE_SESSION_SET_PORT,
  DEVICE_SESSION_SET_SESSION,
  DEVICE_SESSION_START,
  DEVICE_SESSION_STOPPED,
  DEVICE_SESSION_STOPPING,
  DEVICE_LOG_TOGGLE,
  STORE_IN_USE_SESSION,
  CLEAR_DEVICE_SERVER_LOGS,
  API_STATUS,
  DEVICE_SESSION_STATUS,
  DEVICE_SESSION_LOGS,
  SEARCH_DEVICES,
  DEVICE_SESSION_ADB_CONNECTED,
  DEVICE_SESSION_ADB_DISCONNECTED,
  SET_TUNNEL_IDENTIFIER,
  FETCH_AVAILABLE_DEVICES_LOADING,
  FETCH_AVAILABLE_DEVICES_SUCCESS,
  FETCH_AVAILABLE_DEVICES_ERROR
} from './actions';

const initialState = {
  status: API_STATUS.IDLE,
  deviceQuery: '',
  devices: {},
  queryResults: {},
  error: null,
  connectedDevices: [],
  devicesChecked: false,
  tunnelIdentifier: ''
};

export default function deviceReducer(state = initialState, action) {
  switch (action.type) {
    /**
     * For the API
     */
    case FETCH_DEVICES_LOADING:
      return {
        ...state,
        deviceQuery: '',
        devices: {},
        queryResults: {},
        devicesChecked: false,
        status: API_STATUS.LOADING
      };

    case FETCH_DEVICES_SUCCESS:
      return {
        ...state,
        devices: action.devices,
        queryResults: action.queryResults,
        status: API_STATUS.SUCCESS
      };

    case FETCH_DEVICES_ERROR:
      return {
        ...state,
        error: action.error,
        status: API_STATUS.ERROR
      };

    case FETCH_AVAILABLE_DEVICES_LOADING:
      return {
        ...state
      };

    case FETCH_AVAILABLE_DEVICES_SUCCESS:
      return filterBusyDevices(state, action.devices);

    case FETCH_AVAILABLE_DEVICES_ERROR:
      return {
        ...state,
        error: action.error,
        status: API_STATUS.ERROR
      };

    case SET_TUNNEL_IDENTIFIER:
      return {
        ...state,
        tunnelIdentifier: action.identifier
      };

    /**
     * For the Android device session
     */
    case DEVICE_SESSION_START:
      return getMergedDeviceState({
        state,
        deviceID: action.id,
        error: false,
        log: action.log,
        manualConnect: action.manualConnect,
        status: DEVICE_SESSION_STATUS.CONNECTING,
        connectedDevice: action.id
      });

    case DEVICE_SESSION_LOGS:
      return getMergedDeviceState({
        state,
        deviceID: action.id,
        error: false,
        log: action.log,
        connectedDevice: action.id,
        status: state.devices[action.id].status
      });

    case DEVICE_SESSION_CONNECTED:
      return getMergedDeviceState({
        state,
        deviceID: action.id,
        error: false,
        log: action.log,
        status: DEVICE_SESSION_STATUS.CONNECTED
      });

    case DEVICE_SESSION_SET_SESSION:
      return getMergedDeviceState({
        state,
        deviceID: action.id,
        log: action.log,
        sessionID: action.sessionID,
        status: DEVICE_SESSION_STATUS.CONNECTED
      });

    case DEVICE_SESSION_SET_PORT:
      return getMergedDeviceState({
        state,
        deviceID: action.id,
        log: action.log,
        port: action.port,
        status: DEVICE_SESSION_STATUS.CONNECTED
      });

    case DEVICE_SESSION_ADB_CONNECTED:
      return getMergedDeviceState({
        state,
        deviceID: action.id,
        adbConnected: action.adbConnected,
        status: DEVICE_SESSION_STATUS.CONNECTED
      });

    case DEVICE_SESSION_ADB_DISCONNECTED:
      return getMergedDeviceState({
        state,
        deviceID: action.id,
        adbConnected: action.adbConnected
      });

    case DEVICE_SESSION_STOPPING:
      return getMergedDeviceState({
        state,
        deviceID: action.id,
        log: action.log,
        status: DEVICE_SESSION_STATUS.STOPPING
      });

    case DEVICE_SESSION_STOPPED:
      return getMergedDeviceState({
        state,
        deviceID: action.id,
        disconnectDevice: action.id,
        error: false,
        log: action.log,
        port: '',
        sessionID: '',
        manualConnect: false,
        status: DEVICE_SESSION_STATUS.STOPPED
      });

    case DEVICE_SESSION_ERROR:
      return getMergedDeviceState({
        state,
        deviceID: action.id,
        disconnectDevice: action.id,
        error: true,
        log: action.log,
        manualConnect: false,
        status: DEVICE_SESSION_STATUS.ERROR
      });

    case DEVICE_LOG_TOGGLE:
      return getMergedDeviceState({
        state,
        deviceID: action.id,
        showLogs: !state.devices[action.id].showLogs
      });

    case CLEAR_DEVICE_SERVER_LOGS:
      return getMergedDeviceState({
        state,
        deviceID: action.id,
        clearLogs: true
      });

    case SEARCH_DEVICES:
      return searchDevices({
        state,
        query: action.query
      });

    case STORE_IN_USE_SESSION:
      return getInUseDevices(state, action.data);

    default:
      return state;
  }
}

/**
 * Merge the current device state with a new state
 *
 * @param {object} state
 * @param {object} action
 * @param {boolean} clearLogs
 * @param {string} connectedDevice
 * @param {string} disconnectDevice
 * @param {boolean} manualConnect
 * @param {string} log
 * @param {string} status
 * @param {string} sessionID
 * @param {boolean} showLogs
 * @param {string} port
 * @param {boolean} error
 *
 * @returns {{state:object}}
 */
function getMergedDeviceState({
  state,
  adbConnected,
  clearLogs = false,
  connectedDevice,
  disconnectDevice,
  deviceID,
  error,
  manualConnect,
  status,
  showLogs,
  log,
  port,
  sessionID
}) {
  // eslint-disable-next-line no-nested-ternary
  const connectedDevices = connectedDevice
    ? state.connectedDevices.some((device) => device === connectedDevice)
      ? state.connectedDevices
      : state.connectedDevices.concat(connectedDevice)
    : state.connectedDevices;
  // @TODO: this is horrible, need to find a better way
  const updatedDevice = {};
  updatedDevice[deviceID] = {
    ...state.devices[deviceID],
    status: status === undefined ? state.devices[deviceID].status : status,
    // eslint-disable-next-line no-nested-ternary
    log: log
      ? state.devices[deviceID].log.concat(log)
      : clearLogs
      ? []
      : state.devices[deviceID].log,
    showLogs:
      showLogs === undefined ? state.devices[deviceID].showLogs : showLogs,
    ...(typeof error === 'boolean'
      ? { error }
      : { error: state.devices[deviceID].error }),
    ...(typeof manualConnect === 'boolean'
      ? { manualConnect }
      : { manualConnect: state.devices[deviceID].manualConnect }),
    ...(sessionID || sessionID === '' ? { sessionID } : {}),
    ...(port || port === '' ? { port } : {}),
    adbConnected:
      adbConnected === undefined
        ? state.devices[deviceID].adbConnected
        : adbConnected
  };

  const newState = {
    ...state,
    devices: {
      ...state.devices,
      ...updatedDevice
    },
    connectedDevices: disconnectDevice
      ? connectedDevices.filter((device) => device !== disconnectDevice)
      : connectedDevices
  };

  return searchDevices({
    state: newState,
    query: state.deviceQuery
  });
}

/**
 * Get the in used devices and merge them with the current state
 *
 * @param {object} state
 * @param {array} inUseDevices
 *
 * @returns {{inUseSessions: *}}
 */
function getInUseDevices(state, inUseDevices) {
  const matchedInUseDevices = {};

  Object.keys(state.devices)
    .map((i) => state.devices[i])
    .filter((device) =>
      inUseDevices.find((inUseDevice) => {
        if (
          inUseDevice.os.toUpperCase() === device.os.toUpperCase() &&
          inUseDevice.deviceDescriptorId.toUpperCase() ===
            device.id.toUpperCase() &&
          inUseDevice.osVersion === device.osVersion
        ) {
          matchedInUseDevices[device.id] = {
            ...device,
            // Don't add the device if it's manually connected
            inUse: !device.manualConnect,
            sessionID: inUseDevice.sessionId
          };
        }
      })
    );

  const currentDevices = {
    ...state.devices
  };

  // Find the devices that are not connected
  const currentDeviceKeys = Object.keys(currentDevices);
  const inUseDevicesKeys = Object.keys(matchedInUseDevices);
  const keyDifference = currentDeviceKeys.filter(
    (x) => !inUseDevicesKeys.includes(x)
  );

  // Set devices to available again if they are not in use/connected anymore
  const availableDevices = {};
  keyDifference.map((availableDevice) => {
    if (
      currentDevices[availableDevice].status !==
        DEVICE_SESSION_STATUS.CONNECTING &&
      currentDevices[availableDevice].status !== DEVICE_SESSION_STATUS.ERROR &&
      !currentDevices[availableDevice].manualConnect
    ) {
      availableDevices[availableDevice] = {
        ...currentDevices[availableDevice],
        inUse: false,
        port: '',
        sessionID: ''
      };
    }
  });

  const connectedDevices = state.connectedDevices.filter(
    (connectedDevice) =>
      !keyDifference.some(
        (disconnectedDevice) => disconnectedDevice === connectedDevice
      )
  );
  const newState = {
    ...state,
    devices: {
      ...currentDevices,
      ...matchedInUseDevices,
      ...availableDevices
    },
    devicesChecked: true,
    connectedDevices
  };

  return searchDevices({
    state: newState,
    query: state.deviceQuery
  });
}

/**
 * Search the devices
 *
 * @param {object} state
 * @param {string} query
 *
 * @returns {{deviceQuery: *, queryResults: (*)}}
 */
function searchDevices({ state, query }) {
  const { devices } = state;
  const searchQuery = query || state.deviceQuery;

  const matchedDevices = Object.keys(devices)
    .map((i) => devices[i])
    .filter((device) => {
      const queryArray = searchQuery
        .split(' ')
        .map((val) => val.toUpperCase().toString());
      const deviceValues = Object.values(device)
        .filter((value) => typeof value === 'string')
        .map((val) => val.toUpperCase().toString());

      return queryArray.every((searchValue) =>
        deviceValues.find(
          (deviceValue) =>
            typeof deviceValue === 'string' &&
            deviceValue.includes(searchValue.toUpperCase())
        )
      );
    });

  return {
    ...state,
    deviceQuery: query,
    queryResults: query === '' ? devices : matchedDevices
  };
}

/**
 * Filter busy devices and set the state
 *
 * @param {object} state
 * @param {array} availableDevices
 *
 * @returns {*}
 */
function filterBusyDevices(state, availableDevices) {
  const newDevices = {};

  Object.keys(state.devices)
    .map((i) => state.devices[i])
    .filter((device) => {
      newDevices[device.id] = {
        ...device,
        // If the device.id is not in the availableDevices the device
        // is busy
        isBusy: !availableDevices.includes(device.id)
      };
    });

  return {
    ...state,
    devices: {
      ...state.devices,
      ...newDevices
    }
  };
}
