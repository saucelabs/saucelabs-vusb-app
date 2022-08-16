import { trimLogArray } from '../utils/Helpers';
import { ApiStatusEnum } from '../../types/DeviceApiTypes';
import {
  DeviceActionEnum as ACTIONS,
  DevicesActionType,
  DeviceSessionStatusEnum,
  DevicesStateType,
  InUseDevicesType,
} from '../../types/DeviceTypes';

/**
 * Filter all devices that are in use, meaning all devices that have a manual /
 * automated session running.
 */
function filterInUseDevices(
  state: DevicesStateType,
  inUseDevices: InUseDevicesType[]
): DevicesStateType {
  const processedDevices = state.devices.map((device) => {
    const matchingDevice = inUseDevices.filter(
      (inUseDevice) => inUseDevice.deviceDescriptorId === device.descriptorId
    );

    return {
      ...device,
      // Merge with connected data if available
      ...(matchingDevice.length > 0
        ? {
            ...device,
            inUse: true,
            sessionID: matchingDevice[0].sessionId,
          }
        : {}),
      // When the device is not being used reset it
      ...(device.status !== DeviceSessionStatusEnum.CONNECTING &&
      device.status !== DeviceSessionStatusEnum.ERROR &&
      matchingDevice.length === 0
        ? {
            inUse: false,
            port: 0,
            sessionID: '',
            status: DeviceSessionStatusEnum.STOPPED,
          }
        : {}),
    };
  });

  return {
    ...state,
    devicesChecked: true,
    ...{ devices: processedDevices },
  };
}

/**
 * Filter all devices that have status busy, meaning they are shown in the Sauce
 * UI as busy
 */
function filterBusyDevices(
  state: DevicesStateType,
  availableDevices: string[]
): DevicesStateType {
  return {
    ...state,
    ...{
      devices: state.devices.map((device) => ({
        ...device,
        isBusy: !availableDevices.includes(device.descriptorId),
        status:
          availableDevices.includes(device.descriptorId) &&
          device.status !== DeviceSessionStatusEnum.CONNECTING
            ? DeviceSessionStatusEnum.IDLE
            : device.status,
      })),
    },
  };
}

/**
 * Filter the devices based on a search string
 */
function filterDevices(
  state: DevicesStateType,
  query: string
): DevicesStateType {
  const processedDevices = state.devices.map((device) => {
    const queryArray = query
      .split(' ')
      .map((val) => val.toString().toUpperCase());
    const deviceValues = Object.values(device)
      // First get all device values that are a string or a number
      .filter(
        (deviceValue) =>
          (typeof deviceValue === 'string' ||
            typeof deviceValue === 'number') &&
          deviceValue !== ''
      )
      // now transform them to uppercase
      .map((val) => (val as string | number).toString().toUpperCase());

    const matchingDevice = queryArray.every((searchValue) =>
      // Now check if we have a matching device
      deviceValues.find((deviceValue) =>
        deviceValue.includes(searchValue.toUpperCase())
      )
    );

    return {
      ...device,
      showDevice: matchingDevice,
    };
  });

  return {
    ...state,
    deviceQuery: query,
    devices: processedDevices,
  };
}

/**
 * Determine the device state
 */
function determineNewDeviceState({
  adbConnected,
  connectDevice,
  clearLogs,
  descriptorId,
  error,
  log,
  manualConnect,
  port,
  showLogs,
  state,
  status,
}: {
  adbConnected?: boolean;
  clearLogs?: boolean;
  connectDevice?: boolean;
  descriptorId: string;
  error?: boolean;
  log?: string[] | undefined;
  port?: number | undefined;
  manualConnect?: boolean;
  showLogs?: boolean;
  state: DevicesStateType;
  status?: string;
}): DevicesStateType {
  const connectedDevices =
    // eslint-disable-next-line no-nested-ternary
    typeof connectDevice === 'boolean'
      ? // eslint-disable-next-line no-nested-ternary
        connectDevice
        ? // if the device is already connected
          state.connectedDevices.some((device) => device === descriptorId)
          ? // Keep the current array
            state.connectedDevices
          : // add the device to the connected ones
            state.connectedDevices.concat(descriptorId)
        : // the device needs to be removed from the array
          state.connectedDevices.filter(
            (connectedDevice) => connectedDevice !== descriptorId
          )
      : state.connectedDevices;

  return {
    ...state,
    connectedDevices,
    ...{
      devices: state.devices.map((device) =>
        device.descriptorId === descriptorId
          ? {
              ...device,
              ...{
                ...(typeof adbConnected === 'boolean' ? { adbConnected } : {}),
                ...(typeof error === 'boolean' ? { error } : {}),
                // Clear or add new log
                log: clearLogs ? [] : log || device.log,
                ...(typeof port === 'number' ? { port } : {}),
                ...(typeof manualConnect === 'boolean'
                  ? { manualConnect }
                  : {}),
                ...(typeof showLogs === 'boolean' ? { showLogs } : {}),
                ...(status
                  ? {
                      status:
                        // If the device was connecting and the status is now connected/error, use that status
                        // otherwise keep it to connecting
                        (device.status === DeviceSessionStatusEnum.CONNECTING &&
                          status !== DeviceSessionStatusEnum.CONNECTED &&
                          status !== DeviceSessionStatusEnum.ERROR) ||
                        // If the device was stopping and the status is now stopped, use that status
                        // otherwise keep it to stopping
                        (device.status === DeviceSessionStatusEnum.STOPPING &&
                          status !== DeviceSessionStatusEnum.STOPPED) ||
                        // If the device was stopped and is now connected again, then keep the stopped status
                        // otherwise use the new status (which could be connecting/error)
                        (device.status === DeviceSessionStatusEnum.STOPPED &&
                          status === DeviceSessionStatusEnum.CONNECTED)
                          ? device.status
                          : status,
                    }
                  : {}),
              },
            }
          : device
      ),
    },
  };
}

const initialDevicesState: DevicesStateType = {
  connectedDevices: [],
  deviceQuery: '',
  devices: [],
  devicesChecked: false,
  error: null,
  status: ApiStatusEnum.IDLE,
  tunnelIdentifier: null,
};
const devicesReducer = (
  state: DevicesStateType = initialDevicesState,
  action: DevicesActionType
) => {
  let currentLogs: string[] = [];
  let logLineArray: string[] = [];
  if ('descriptorId' in action) {
    const currentDevice = state.devices.find(
      (device) => device.descriptorId === action.descriptorId
    );
    currentLogs = currentDevice?.log || currentLogs;
    const actionLog = 'log' in action ? action.log : '';
    const logLine =
      typeof actionLog === 'string'
        ? actionLog
        : new TextDecoder('utf-8').decode(actionLog);
    logLineArray =
      logLine.length > 0
        ? logLine.split('\n').filter((entry: string) => entry)
        : [];
  }

  switch (action.type) {
    case ACTIONS.DEVICE_SESSION_ERROR:
      return determineNewDeviceState({
        descriptorId: action.descriptorId,
        error: true,
        log: trimLogArray(currentLogs.concat(logLineArray)),
        manualConnect: action.manualConnect,
        state,
        status: DeviceSessionStatusEnum.ERROR,
      });
    case ACTIONS.DEVICE_SESSION_RUNNING:
      return determineNewDeviceState({
        adbConnected: action.adbConnected,
        descriptorId: action.descriptorId,
        log: trimLogArray(currentLogs.concat(logLineArray)),
        manualConnect: action.manualConnect,
        port: action.port,
        state,
        status: DeviceSessionStatusEnum.CONNECTED,
      });
    case ACTIONS.DEVICE_SESSION_STARTING:
      return determineNewDeviceState({
        descriptorId: action.descriptorId,
        log: trimLogArray(currentLogs.concat(logLineArray)),
        state,
        status: DeviceSessionStatusEnum.CONNECTING,
      });
    case ACTIONS.DEVICE_SESSION_STOPPING:
      return determineNewDeviceState({
        descriptorId: action.descriptorId,
        log: trimLogArray(currentLogs.concat(logLineArray)),
        state,
        status: DeviceSessionStatusEnum.STOPPING,
      });
    case ACTIONS.DEVICE_SESSION_STOPPED:
      return determineNewDeviceState({
        adbConnected: action.adbConnected,
        connectDevice: false,
        descriptorId: action.descriptorId,
        log: trimLogArray(currentLogs.concat(logLineArray)),
        port: action.port,
        state,
        status: DeviceSessionStatusEnum.STOPPED,
      });
    case ACTIONS.DEVICE_LOG_TOGGLE:
      return determineNewDeviceState({
        descriptorId: action.descriptorId,
        showLogs: !action.showLogs,
        state,
      });
    case ACTIONS.DEVICE_SESSION_CLEAR_LOGS:
      return determineNewDeviceState({
        descriptorId: action.descriptorId,
        clearLogs: true,
        state,
      });
    case ACTIONS.FETCH_DEVICES_LOADING:
      return {
        ...state,
        status: ApiStatusEnum.LOADING,
      };
    case ACTIONS.FETCH_DEVICES_SUCCESS:
      return {
        ...state,
        devices: action.devices,
        status: ApiStatusEnum.SUCCESS,
      };
    case ACTIONS.FETCH_DEVICES_ERROR:
      return {
        ...state,
        error: action.error,
        status: ApiStatusEnum.ERROR,
      };
    case ACTIONS.FETCH_AVAILABLE_DEVICES_LOADING:
      return {
        ...state,
      };
    case ACTIONS.FETCH_AVAILABLE_DEVICES_SUCCESS:
      return filterBusyDevices(state, action.availableDevices);
    case ACTIONS.FETCH_AVAILABLE_DEVICES_ERROR:
      return {
        ...state,
        error: action.error,
      };
    case ACTIONS.STORE_IN_USE_DEVICES:
      return filterInUseDevices(state, action.inUseDevices);
    case ACTIONS.IN_USE_DEVICES_ERROR:
      return {
        ...state,
        error: action.error,
      };
    case ACTIONS.SEARCH_DEVICES:
      return filterDevices(state, action.searchTerm);
    case ACTIONS.SET_TUNNEL_IDENTIFIER:
      return {
        ...state,
        tunnelIdentifier: action.tunnelIdentifier,
      };
    default:
      return state;
  }
};

export {
  devicesReducer,
  filterDevices,
  filterInUseDevices,
  initialDevicesState,
};
