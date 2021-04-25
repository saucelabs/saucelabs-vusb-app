import { spawn } from 'child_process';
import fixPath from 'fix-path';
import { getGenericStorage } from '../../settings/duck/settings.storage';
import { getVusbFilePath, writeDataToFile } from '../../helpers/utils';
import {
  DEVICE_SESSION_STATUS,
  deviceSessionConnected,
  deviceSessionError,
  deviceSessionStart,
  deviceSessionStopped,
  deviceSessionStopping,
  deviceSessionStoreAdbConnectedStatus,
  deviceSessionStoreLog,
  deviceSessionStorePort,
  deviceSessionStoreSession
} from './actions';
import { VUSB_SERVER_STATUS } from '../../monitor/duck/actions';
import { storeAdbConnectedDevicesLog } from '../../monitor/duck/server.operations';

fixPath();

export function startDeviceSession(id) {
  const { connection, device, server } = getGenericStorage();

  return (dispatch, getState) => {
    const serverStatus = getState().server.status;
    const { devices, tunnelIdentifier } = getState().deviceApi;
    const { sessionID } = devices[id];
    const deviceArgs = ['-jar', getVusbFilePath()];

    if (
      serverStatus === VUSB_SERVER_STATUS.IDLE ||
      serverStatus === VUSB_SERVER_STATUS.STOPPED
    ) {
      alert(
        'There is no server running, please enable it with the server play icon in the header.'
      );

      return;
    }

    if (sessionID) {
      deviceArgs.push(
        'connect',
        '--username',
        connection.username,
        '--accessKey',
        connection.access_key,
        '--sessionId',
        sessionID,
        '--serverHost',
        server.host,
        '--serverPort',
        server.port
      );
    } else {
      deviceArgs.push(
        'startSession',
        '--username',
        connection.username,
        '--accessKey',
        connection.access_key,
        '--deviceName',
        id,
        '--serverHost',
        server.host,
        '--serverPort',
        server.port
      );

      if (tunnelIdentifier !== '') {
        deviceArgs.push('--tunnelIdentifier', tunnelIdentifier);
      }

      // Add proxy args
      const { host, port, username, password } = device.proxy;
      if (host) {
        deviceArgs.push('--proxyHost', host);
      }

      if (port) {
        deviceArgs.push('--proxyPort', port);
      }

      if (username) {
        deviceArgs.push('--proxyUser', username);
      }

      if (password) {
        deviceArgs.push('--proxyPassword', password);
      }
    }

    // Write logs to file if needed
    if (server.logs_to_file) {
      writeDataToFile(
        `${id}.log`,
        `Starting device connection: 'java ${deviceArgs.join(' ')}'`
      );
    }

    // Start the device
    const ls = spawn('java', deviceArgs);
    ls.stdout.on('data', (data) => {
      const parsedData = data.toString();
      // @TODO: Need to find a better way for this to do
      const startingConnection = parsedData.match(
        /(INFO com.saucelabs.vusb.client.Runner - Runner Version|WARN com.saucelabs.vusb.client.util.AdbVersionCheck)/
      );
      const connectionStarted = parsedData.match(/(Started new session)/);
      const connectionError = parsedData.match(
        /(ERROR com.saucelabs.vusb.client.Runner)/
      );
      const sessionIDFromLog = parsedData.match(
        /^[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+/i
      );
      // iOS gives back `localhost:-1	online` instead of a port,
      // but this needs to be handled as a proper connection
      const iOSOnlinePort = parsedData.match(/(localhost:-1\s+online)/i);
      // Android gives back `localhost:7000	online` and needs to be added to the device details
      const androidPort = parsedData.match(/^(localhost:)(\d+)/i);

      // Write logs to file if needed
      if (server.logs_to_file) {
        writeDataToFile(`${id}.log`, data);
      }

      if (connectionError) {
        dispatch(deviceSessionError(id, data));
      } else if (sessionIDFromLog) {
        dispatch(deviceSessionStoreSession(id, data, sessionIDFromLog[0]));
      } else if (iOSOnlinePort) {
        dispatch(deviceSessionStorePort(id, data, ''));
      } else if (androidPort) {
        const portNumber = androidPort[2];
        dispatch(deviceSessionStorePort(id, data, portNumber));
        if (server.auto_adb_connect) {
          startAdbConnection(dispatch, id, portNumber);
        }
      } else if (connectionStarted) {
        dispatch(deviceSessionConnected(id, data));
      } else if (startingConnection) {
        // If there is no sessionID, then the session was
        // started through the UI with the startSession command
        const manualConnect = !sessionID;
        dispatch(deviceSessionStart(id, data, manualConnect));
      } else {
        dispatch(deviceSessionStoreLog(id, data));
      }
    });

    ls.stderr.on('data', (data) => {
      // Write logs to file if needed
      if (server.logs_to_file) {
        writeDataToFile(`${id}.log`, data);
      }

      dispatch(deviceSessionError(id, data));
    });

    ls.on('close', () => {
      // @TODO: this is not needed to dispatch because it will cause confusion
    });
  };
}

function startAdbConnection(dispatch, id, port) {
  const adbServer = spawn('adb', ['connect', `localhost:${port}`]);
  const { server } = getGenericStorage();

  adbServer.stdout.on('data', (data) => {
    const isAdbConnected = data.toString().match(/(connected to localhost:)/);

    // Write logs to file if needed
    if (server.logs_to_file) {
      writeDataToFile(`${id}.log`, data);
    }

    // Store the logs
    dispatch(deviceSessionStoreLog(id, data));

    if (isAdbConnected) {
      // Update the store that the device is automatically connected
      dispatch(deviceSessionStoreAdbConnectedStatus(id, true));
      // Store it to the server logs instead of the devices logs
      storeAdbConnectedDevicesLog(dispatch);
    }
  });
  // @TODO: add error,but have never seen this go wrong
}

function stopAdbConnection(dispatch, id, port) {
  const adbServer = spawn('adb', ['disconnect', `localhost:${port}`]);
  const { server } = getGenericStorage();

  adbServer.stdout.on('data', (data) => {
    const isAdbDisconnected = data
      .toString()
      .match(/(disconnected localhost:)/);

    // Write logs to file if needed
    if (server.logs_to_file) {
      writeDataToFile(`${id}.log`, data);
    }

    // Store the logs
    dispatch(deviceSessionStoreLog(id, data));

    if (isAdbDisconnected) {
      // Update the store that the device is automatically connected
      dispatch(deviceSessionStoreAdbConnectedStatus(id, false));
      // Store it to the server logs instead of the devices logs
      storeAdbConnectedDevicesLog(dispatch);
    }
  });
  // @TODO: add error,but have never seen this go wrong
}

export function closeDeviceSession(deviceID) {
  const { connection, server } = getGenericStorage();

  return (dispatch, getState) => {
    let ls;
    const deviceSessionStatus = getState().deviceApi.devices[deviceID].status;
    const { port, sessionID } = getState().deviceApi.devices[deviceID];
    const { manualConnect } = getState().deviceApi.devices[deviceID];

    if (deviceSessionStatus !== DEVICE_SESSION_STATUS.CONNECTED) {
      return;
    }

    if (manualConnect) {
      ls = spawn('java', [
        '-jar',
        getVusbFilePath(),
        'deleteSession',
        '--username',
        connection.username,
        '--accessKey',
        connection.access_key,
        '--sessionId',
        sessionID,
        '--serverHost',
        server.host,
        '--serverPort',
        server.port
      ]);
    } else {
      ls = spawn('java', [
        '-jar',
        getVusbFilePath(),
        'disconnect',
        '--sessionId',
        sessionID,
        '--serverHost',
        server.host,
        '--serverPort',
        server.port
      ]);
    }

    ls.stdout.on('data', (data) => {
      // Write logs to file if needed
      if (server.logs_to_file) {
        writeDataToFile(`${deviceID}.log`, data);
      }

      dispatch(deviceSessionStopping(deviceID, data));
    });

    ls.stderr.on('data', (data) => {
      // Write logs to file if needed
      if (server.logs_to_file) {
        writeDataToFile(`${deviceID}.log`, data);
      }

      dispatch(deviceSessionError(deviceID, data));
    });

    ls.on('close', (code) => {
      dispatch(deviceSessionStopped(deviceID, code));
      if (server.auto_adb_connect) {
        // Stop the ADB connection
        stopAdbConnection(dispatch, deviceID, port);
      }
    });
  };
}
