import {
  DevicesStateInterface,
  InUseDevicesInterface,
} from '../../devices/DeviceInterfaces';
import { trimLogArray } from '../../utils/Helpers';
import {
  DeviceActionEnum as ACTIONS,
  DevicesActionType,
  DeviceSessionStatusEnum,
} from '../../devices/DeviceTypes';
import { ApiStatusEnum } from '../../devices/DeviceApiTypes';

/**
 * Filter all devices that are in use, meaning all devices that have a manual /
 * automated session running.
 */
function filterInUseDevices(
  state: DevicesStateInterface,
  inUseDevices: InUseDevicesInterface[]
): DevicesStateInterface {
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
  state: DevicesStateInterface,
  availableDevices: string[]
) {
  return {
    ...state,
    ...{
      devices: state.devices.map((device) => ({
        ...device,
        isBusy: !availableDevices.includes(device.descriptorId),
      })),
    },
  };
}

/**
 * Filter the devices based on a search string
 */
function filterDevices(state: DevicesStateInterface, query: string) {
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
  deviceId,
  error,
  log,
  port,
  showLogs,
  state,
  status,
}: {
  adbConnected?: boolean;
  clearLogs?: boolean;
  connectDevice?: boolean;
  deviceId: string;
  error?: boolean;
  log?: string[] | undefined;
  port?: number | undefined;
  showLogs?: boolean;
  state: DevicesStateInterface;
  status?: string;
}) {
  const connectedDevices =
    // eslint-disable-next-line no-nested-ternary
    typeof connectDevice === 'boolean'
      ? // eslint-disable-next-line no-nested-ternary
        connectDevice
        ? // if the device is already connected
          state.connectedDevices.some((device) => device === deviceId)
          ? // Keep the current array
            state.connectedDevices
          : // add the device to the connected ones
            state.connectedDevices.concat(deviceId)
        : // the device needs to be removed from the array
          state.connectedDevices.filter(
            (connectedDevice) => connectedDevice !== deviceId
          )
      : state.connectedDevices;

  return {
    ...state,
    connectedDevices,
    ...{
      devices: state.devices.map((device) =>
        device.descriptorId === deviceId
          ? {
              ...device,
              ...{
                ...(typeof adbConnected === 'boolean' ? { adbConnected } : {}),
                ...(typeof error === 'boolean' ? { error } : {}),
                // Clear or add new log
                log: clearLogs ? [] : log || device.log,
                ...(typeof port === 'number' ? { port } : {}),
                ...(typeof showLogs === 'boolean' ? { showLogs } : {}),
                ...(status
                  ? {
                      status:
                        (device.status === DeviceSessionStatusEnum.CONNECTING &&
                          status !== DeviceSessionStatusEnum.CONNECTED) ||
                        (device.status === DeviceSessionStatusEnum.STOPPING &&
                          status !== DeviceSessionStatusEnum.STOPPED) ||
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

const initialDevicesState: DevicesStateInterface = {
  status: ApiStatusEnum.IDLE,
  deviceQuery: '',
  devices: [],
  error: null,
  connectedDevices: [],
  devicesChecked: false,
};
const devicesReducer = (
  state: DevicesStateInterface = initialDevicesState,
  action: DevicesActionType
) => {
  let currentLogs: string[] = [];
  let logLineArray: string[] = [];
  if ('deviceId' in action) {
    const currentDevice = state.devices.find(
      (device) => device.descriptorId === action.deviceId
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
        deviceId: action.deviceId,
        error: true,
        log: trimLogArray(currentLogs.concat(logLineArray)),
        state,
        status: DeviceSessionStatusEnum.ERROR,
      });
    case ACTIONS.DEVICE_SESSION_SET_PORT:
      return determineNewDeviceState({
        connectDevice: true,
        deviceId: action.deviceId,
        log: trimLogArray(currentLogs.concat(logLineArray)),
        port: action.port,
        state,
        status: DeviceSessionStatusEnum.CONNECTED,
      });
    case ACTIONS.DEVICE_SESSION_LOGS:
      return determineNewDeviceState({
        deviceId: action.deviceId,
        log: trimLogArray(currentLogs.concat(logLineArray)),
        state,
        status: DeviceSessionStatusEnum.CONNECTED,
      });
    case ACTIONS.DEVICE_SESSION_ADB_CONNECTED:
      return determineNewDeviceState({
        deviceId: action.deviceId,
        adbConnected: true,
        state,
        status: DeviceSessionStatusEnum.CONNECTED,
      });
    case ACTIONS.DEVICE_SESSION_START:
      return determineNewDeviceState({
        deviceId: action.deviceId,
        log: trimLogArray(currentLogs.concat(logLineArray)),
        state,
        status: DeviceSessionStatusEnum.CONNECTING,
      });
    case ACTIONS.DEVICE_SESSION_STOPPING:
      return determineNewDeviceState({
        deviceId: action.deviceId,
        log: trimLogArray(currentLogs.concat(logLineArray)),
        state,
        status: DeviceSessionStatusEnum.STOPPING,
      });
    case ACTIONS.DEVICE_SESSION_STOPPED:
      return determineNewDeviceState({
        connectDevice: false,
        deviceId: action.deviceId,
        log: trimLogArray(currentLogs.concat(logLineArray)),
        state,
        status: DeviceSessionStatusEnum.STOPPED,
      });
    case ACTIONS.DEVICE_LOG_TOGGLE:
      return determineNewDeviceState({
        deviceId: action.deviceId,
        showLogs: !action.showLogs,
        state,
      });
    case ACTIONS.DEVICE_SESSION_CLEAR_LOGS:
      return determineNewDeviceState({
        deviceId: action.deviceId,
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
    default:
      return state;
  }
};

export { devicesReducer, initialDevicesState };
