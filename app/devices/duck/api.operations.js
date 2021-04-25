import axios from 'axios';
import {
  DEVICE_SESSION_STATUS,
  fetchAvailableDevicesError,
  fetchAvailableDevicesLoading,
  fetchAvailableDevicesSuccess,
  fetchDevicesError,
  fetchDevicesLoading,
  fetchDevicesSuccess,
  getDeviceSessionsError,
  storeUsedSession
} from './actions';
import { getGenericStorage } from '../../settings/duck/settings.storage';
import { isMac, isWindows, isLinux } from '../../helpers/checks';
import { LOCATION, MOBILE_OS } from '../../helpers/constants';
import { VUSB_SERVER_STATUS } from '../../monitor/duck/actions';

const upDevicesUrl = 'saucelabs.com/v1/rdc/devices/filtered?dataCenterId=';
const upAvailableDevicesUrl = 'saucelabs.com/v1/rdc/devices/available';
const INITIAL_STATE = {
  status: DEVICE_SESSION_STATUS.IDLE,
  adbConnected: false,
  log: [],
  inUse: false,
  error: false,
  sessionID: '',
  port: '',
  location: getGenericStorage().connection.location,
  showLogs: false
};

/**
 * Get the devices
 */
export function getDevices() {
  const { connection, proxy: proxyData } = getGenericStorage();
  const { location, username, access_key } = connection;
  const dcEndpoint = LOCATION[location.toUpperCase()].endpoint;
  const { proxy_host, proxy_port, proxy_username, proxy_password } = proxyData;
  const proxy = {
    host: proxy_host,
    port: proxy_port,
    ...(proxy_username && proxy_password
      ? {
          auth: {
            username: proxy_username,
            password: proxy_password
          }
        }
      : {})
  };
  // For now it doesn't matter if we use the Android or iOS API key
  const auth = Buffer.from(`${username}:${access_key}`).toString('base64');

  return async (dispatch) => {
    dispatch(fetchDevicesLoading());

    try {
      const response = await axios.get(
        `https://api.${dcEndpoint}.${upDevicesUrl}${location}`,
        {
          method: 'GET',
          headers: {
            authorization: `Basic ${auth}`,
            'Cache-Control': 'no-store'
          },
          ...(proxy_host && proxy_port ? proxy : {})
        }
      );

      const devices = response.data.entities
        // Find all private devices
        .filter(
          (device) =>
            device.cloudType.toUpperCase() === 'PRIVATE' &&
            (((isWindows() || isLinux()) &&
              device.os.toUpperCase() === MOBILE_OS.ANDROID) ||
              (isMac() &&
                (device.os.toUpperCase() === MOBILE_OS.ANDROID ||
                  device.os.toUpperCase() === MOBILE_OS.IOS)))
        )
        .map((device) => ({
          ...device,
          id: device.descriptorId
        }))
        .sort((a, b) => {
          const deviceA = a.name.toUpperCase();
          const deviceB = b.name.toUpperCase();

          // eslint-disable-next-line no-nested-ternary
          return deviceA === deviceB ? 0 : deviceA > deviceB ? 1 : -1;
        })
        // Turn the array into an object and add the initial state to it
        .reduce(
          (obj, device) => ({
            ...obj,
            [device.id]: {
              ...INITIAL_STATE,
              ...device,
              location
            }
          }),
          {}
        );

      return dispatch(fetchDevicesSuccess(devices));
    } catch (error) {
      return dispatch(fetchDevicesError(error));
    }
  };
}

/**
 * Get all the active devices
 */
export function getActiveDevices() {
  const { connection, proxy: proxyData, server } = getGenericStorage();
  const { username, access_key } = connection;
  const { proxy_host, proxy_port, proxy_username, proxy_password } = proxyData;
  const proxy = {
    host: proxy_host,
    port: proxy_port,
    ...(proxy_username && proxy_password
      ? {
          auth: {
            username: proxy_username,
            password: proxy_password
          }
        }
      : {})
  };
  return async (dispatch, getState) => {
    const serverStatus = getState().server.status;

    if (serverStatus === VUSB_SERVER_STATUS.RUNNING) {
      const auth = Buffer.from(`${username}:${access_key}`).toString('base64');

      try {
        const { sessions } = (
          await axios.get(`${server.host}:${server.port}/sessions`, {
            method: 'GET',
            headers: {
              authorization: `Basic ${auth}`
            },
            ...(proxy_host && proxy_port ? proxy : {})
          })
        ).data;

        return dispatch(storeUsedSession(sessions));
      } catch (error) {
        return dispatch(getDeviceSessionsError(error));
      }
    }
  };
}

/**
 * Get all available devices, this will contain an API call that will only return an array
 * with all available devices. If it's not in the array, it's not available and someone
 * might be using it
 */
export function getAvailableDevices() {
  const { connection, proxy: proxyData } = getGenericStorage();
  const { username, access_key, location } = connection;
  const dcEndpoint = LOCATION[location.toUpperCase()].endpoint;
  const { proxy_host, proxy_port, proxy_username, proxy_password } = proxyData;
  const proxy = {
    host: proxy_host,
    port: proxy_port,
    ...(proxy_username && proxy_password
      ? {
          auth: {
            username: proxy_username,
            password: proxy_password
          }
        }
      : {})
  };
  // For now it doesn't matter if we use the Android or iOS API key
  const auth = Buffer.from(`${username}:${access_key}`).toString('base64');

  return async (dispatch) => {
    dispatch(fetchAvailableDevicesLoading());

    try {
      const availableDevices = await axios.get(
        `https://api.${dcEndpoint}.${upAvailableDevicesUrl}`,
        {
          method: 'GET',
          headers: {
            authorization: `Basic ${auth}`,
            'Cache-Control': 'no-store'
          },
          ...(proxy_host && proxy_port ? proxy : {})
        }
      );

      return dispatch(fetchAvailableDevicesSuccess(availableDevices.data));
    } catch (error) {
      return dispatch(fetchAvailableDevicesError(error));
    }
  };
}
