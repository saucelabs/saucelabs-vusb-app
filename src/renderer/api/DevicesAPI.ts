/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios, { AxiosError } from 'axios';
import { LOCATION, MOBILE_OS } from 'renderer/utils/Constants';
import { ServerActionEnum } from '../../types/ServerTypes';
import {
  DeviceActionEnum as ACTIONS,
  DeviceSessionStatusEnum,
  DeviceStateType,
  ExtraDeviceStateType,
} from '../../types/DeviceTypes';
import {
  GetAvailableDevicesType,
  GetDevicesType,
  GetInUseDevicesType,
} from '../../types/DeviceApiTypes';

const upDevicesUrl = 'saucelabs.com/v1/rdc/devices/filtered?dataCenterId=';
const upAvailableDevicesUrl = 'saucelabs.com/v1/rdc/devices/available';
const EXTRA_INITIAL_DEVICE_STATE: ExtraDeviceStateType = {
  adbConnected: false,
  error: false,
  inUse: false,
  isBusy: false,
  dc: 'eu',
  log: [],
  manualConnect: false,
  portNumber: 0,
  sessionID: '',
  showDevice: true,
  showLogs: false,
  status: DeviceSessionStatusEnum.IDLE,
};

/**
 * Get the devices
 */
async function getDevices({
  dispatch,
  isWindows,
  isLinux,
  isMac,
  storageData,
}: GetDevicesType) {
  const {
    connection,
    device: {
      proxy: {
        host: deviceProxyHost,
        portNumber: deviceProxyPort,
        username: deviceProxyUsername,
        password: deviceProxyPassword,
      },
    },
  } = storageData;
  const { location, username, accessKey } = connection;
  // @ts-ignore
  const dcEndpoint = LOCATION[location.toUpperCase()].endpoint;
  const deviceProxy = {
    host: deviceProxyHost,
    portNumber: deviceProxyPort,
    ...(deviceProxyUsername && deviceProxyPassword
      ? {
          auth: {
            username: deviceProxyUsername,
            password: deviceProxyPassword,
          },
        }
      : {}),
  };

  dispatch({ type: ACTIONS.FETCH_DEVICES_LOADING });

  try {
    const response: DeviceStateType[] = (
      await axios.get(`https://api.${dcEndpoint}.${upDevicesUrl}${location}`, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${btoa(`${username}:${accessKey}`)}`,
          'Cache-Control': 'no-store',
        },
        ...(deviceProxyHost && deviceProxyPort ? deviceProxy : {}),
      })
    ).data.entities;

    const devices: DeviceStateType[] = response
      // Find all private devices
      .filter(
        (device) =>
          device.cloudType.toUpperCase() === 'PRIVATE' &&
          (((isWindows || isLinux) &&
            device.os.toUpperCase() === MOBILE_OS.ANDROID) ||
            (isMac &&
              (device.os.toUpperCase() === MOBILE_OS.ANDROID ||
                device.os.toUpperCase() === MOBILE_OS.IOS)))
      )
      .map(
        (device): DeviceStateType => ({
          ...device,
          // Add an extra state that we need during the usage of the app
          ...EXTRA_INITIAL_DEVICE_STATE,
          dc: location.toLowerCase(),
        })
      )
      .sort((a, b) => {
        const deviceA = a.name.toUpperCase();
        const deviceB = b.name.toUpperCase();

        // eslint-disable-next-line no-nested-ternary
        return deviceA === deviceB ? 0 : deviceA > deviceB ? 1 : -1;
      });

    dispatch({ type: ACTIONS.FETCH_DEVICES_SUCCESS, devices });
  } catch (error) {
    dispatch({ type: ACTIONS.FETCH_DEVICES_ERROR, error });
  }
}

/**
 * Get all in use devices, these are the devices that are used by the user
 * with the same username and accessKey
 */
async function getInUseDevices({
  dispatch,
  storageData,
  vusbStatus,
}: GetInUseDevicesType) {
  if (vusbStatus === ServerActionEnum.VUSB_RUNNING) {
    const {
      connection,
      device: {
        proxy: {
          host: deviceProxyHost,
          portNumber: deviceProxyPort,
          username: deviceProxyUsername,
          password: deviceProxyPassword,
        },
      },
      server: { host: serverHost, portNumber: serverPort },
    } = storageData;
    const { username, accessKey } = connection;
    const deviceProxy = {
      host: deviceProxyHost,
      portNumber: deviceProxyPort,
      ...(deviceProxyUsername && deviceProxyPassword
        ? {
            auth: {
              username: deviceProxyUsername,
              password: deviceProxyPassword,
            },
          }
        : {}),
    };

    try {
      const { sessions: inUseDevices } = (
        await axios.get(`${serverHost}:${serverPort}/sessions`, {
          method: 'GET',
          headers: {
            Authorization: `Basic ${btoa(`${username}:${accessKey}`)}`,
            'Cache-Control': 'no-store',
          },
          ...(deviceProxyHost && deviceProxyPort ? deviceProxy : {}),
        })
      ).data;
      dispatch({
        type: ACTIONS.STORE_IN_USE_DEVICES,
        inUseDevices,
      });
    } catch (error) {
      dispatch({ type: ACTIONS.IN_USE_DEVICES_ERROR, error });
    }
  }
}

/**
 * Get all available devices, this will be a list of descriptors that can be used
 */
async function getAvailableDevices({
  dispatch,
  storageData,
}: GetAvailableDevicesType) {
  const {
    connection,
    device: {
      proxy: {
        host: deviceProxyHost,
        portNumber: deviceProxyPort,
        username: deviceProxyUsername,
        password: deviceProxyPassword,
      },
    },
  } = storageData;
  const { location, username, accessKey } = connection;
  // @ts-ignore
  const dcEndpoint = LOCATION[location.toUpperCase()].endpoint;
  const deviceProxy = {
    host: deviceProxyHost,
    portNumber: deviceProxyPort,
    ...(deviceProxyUsername && deviceProxyPassword
      ? {
          auth: {
            username: deviceProxyUsername,
            password: deviceProxyPassword,
          },
        }
      : {}),
  };

  dispatch({ type: ACTIONS.FETCH_AVAILABLE_DEVICES_LOADING });

  try {
    const availableDevices = (
      await axios.get(`https://api.${dcEndpoint}.${upAvailableDevicesUrl}`, {
        method: 'GET',
        headers: {
          authorization: `Basic ${btoa(`${username}:${accessKey}`)}`,
          'Cache-Control': 'no-store',
        },
        ...(deviceProxyHost && deviceProxyPort ? deviceProxy : {}),
      })
    ).data;

    return dispatch({
      type: ACTIONS.FETCH_AVAILABLE_DEVICES_SUCCESS,
      availableDevices,
    });
  } catch (error) {
    return dispatch({
      type: ACTIONS.FETCH_AVAILABLE_DEVICES_ERROR,
      error: error as AxiosError,
    });
  }
}

export { getAvailableDevices, getInUseDevices, getDevices };
