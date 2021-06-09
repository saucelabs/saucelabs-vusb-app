import axios from 'axios';
import {
  DEVICE_SESSION_STATUS,
  DeviceActionTypes as ACTIONS,
} from '../store/actions/DeviceActions';
import { DevicesActionType, DeviceStateType } from '../types/DeviceTypes';
import { isLinux, isMac, isWindows } from '../utils/Checks';
import { LOCATION, MOBILE_OS } from '../utils/Constants';
import { VUSB_SERVER_STATUS } from '../store/actions/ServerActions';
import { getGenericStorage } from '../settings/SettingsStorage';

const upDevicesUrl = 'saucelabs.com/v1/rdc/devices/filtered?dataCenterId=';
const upAvailableDevicesUrl = 'saucelabs.com/v1/rdc/devices/available';
const EXTRA_INITIAL_DEVICE_STATE = {
  adbConnected: false,
  error: null,
  inUse: false,
  isBusy: false,
  log: [],
  manualConnect: false,
  port: 0,
  sessionID: '',
  showDevice: true,
  showLogs: false,
  status: DEVICE_SESSION_STATUS.IDLE,
};

/**
 * Get the devices
 */
async function getDevices(dispatch: (object: DevicesActionType) => void) {
  const { connection, proxy: proxyData } = getGenericStorage();
  const { location, username, accessKey } = connection;
  const dcEndpoint = LOCATION[location.toUpperCase()].endpoint;
  const {
    host: proxyHost,
    port: proxyPort,
    username: proxyUsername,
    password: proxyPassword,
  } = proxyData;
  const proxy = {
    host: proxyHost,
    port: proxyPort,
    ...(proxyUsername && proxyPassword
      ? {
          auth: {
            username: proxyUsername,
            password: proxyPassword,
          },
        }
      : {}),
  };
  const auth = Buffer.from(`${username}:${accessKey}`).toString('base64');

  dispatch({ type: ACTIONS.FETCH_DEVICES_LOADING });

  try {
    const response = await axios.get(
      `https://api.${dcEndpoint}.${upDevicesUrl}${location}`,
      {
        method: 'GET',
        headers: {
          authorization: `Basic ${auth}`,
          'Cache-Control': 'no-store',
        },
        ...(proxyHost && proxyPort ? proxy : {}),
      }
    );

    const devices: DeviceStateType[] = response.data.entities
      // Find all private devices
      .filter(
        (device: DeviceStateType) =>
          device.cloudType.toUpperCase() === 'PRIVATE' &&
          (((isWindows() || isLinux()) &&
            device.os.toUpperCase() === MOBILE_OS.ANDROID) ||
            (isMac() &&
              (device.os.toUpperCase() === MOBILE_OS.ANDROID ||
                device.os.toUpperCase() === MOBILE_OS.IOS)))
      )
      .map((device: DeviceStateType) => ({
        ...device,
        // Add an extra state that we need during the usage of the app
        ...EXTRA_INITIAL_DEVICE_STATE,
      }))
      .sort((a: DeviceStateType, b: DeviceStateType) => {
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
async function getInUseDevices(
  dispatch: (object: DevicesActionType) => void,
  vusbStatus: string
) {
  if (vusbStatus === VUSB_SERVER_STATUS.RUNNING) {
    const { connection, proxy: proxyData, server } = getGenericStorage();
    const { username, accessKey } = connection;
    const {
      host: proxyHost,
      port: proxyPort,
      username: proxyUsername,
      password: proxyPassword,
    } = proxyData;
    const proxy = {
      host: proxyHost,
      port: proxyPort,
      ...(proxyUsername && proxyPassword
        ? {
            auth: {
              username: proxyUsername,
              password: proxyPassword,
            },
          }
        : {}),
    };
    const auth = Buffer.from(`${username}:${accessKey}`).toString('base64');

    try {
      const { sessions: inUseDevices } = (
        await axios.get(`${server.host}:${server.port}/sessions`, {
          method: 'GET',
          headers: {
            authorization: `Basic ${auth}`,
          },
          ...(proxyHost && proxyPort ? proxy : {}),
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

async function getAvailableDevices(
  dispatch: (object: DevicesActionType) => void
) {
  const { connection, proxy: proxyData } = getGenericStorage();
  const { username, accessKey, location } = connection;
  const dcEndpoint = LOCATION[location.toUpperCase()].endpoint;
  const {
    host: proxyHost,
    port: proxyPort,
    username: proxyUsername,
    password: proxyPassword,
  } = proxyData;
  const proxy = {
    host: proxyHost,
    port: proxyPort,
    ...(proxyUsername && proxyPassword
      ? {
          auth: {
            username: proxyUsername,
            password: proxyPassword,
          },
        }
      : {}),
  };
  const auth = Buffer.from(`${username}:${accessKey}`).toString('base64');

  dispatch({ type: ACTIONS.FETCH_AVAILABLE_DEVICES_LOADING });

  try {
    const availableDevices = (
      await axios.get(`https://api.${dcEndpoint}.${upAvailableDevicesUrl}`, {
        method: 'GET',
        headers: {
          authorization: `Basic ${auth}`,
          'Cache-Control': 'no-store',
        },
        ...(proxyHost && proxyPort ? proxy : {}),
      })
    ).data;

    return dispatch({
      type: ACTIONS.FETCH_AVAILABLE_DEVICES_SUCCESS,
      availableDevices,
    });
  } catch (error) {
    return dispatch({ type: ACTIONS.FETCH_AVAILABLE_DEVICES_ERROR, error });
  }
}

export { getAvailableDevices, getInUseDevices, getDevices };
