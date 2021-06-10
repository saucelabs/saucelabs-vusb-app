import { ChildProcess, spawn } from 'child_process';
import fixPath from 'fix-path';
import { getGenericStorage } from '../settings/SettingsStorage';
import { getVusbFilePath, writeDataToFile } from '../utils/Helpers';
import {
  deviceSessionError,
  deviceSessionStart,
  deviceSessionStopped,
  deviceSessionStopping,
  deviceSessionStoreAdbConnectedStatus,
  deviceSessionStoreLog,
  deviceSessionStorePort,
} from '../store/actions/DeviceActions';
import { storeAdbConnectedDeviceLog } from '../server/ServerOperations';
import { DispatchType } from '../store/Store';
import { DeviceSessionStatusEnum } from './DeviceTypes';

fixPath();

/**
 * Start the ADB connection and log all steps
 */
function startAdbConnection(
  dispatch: DispatchType,
  deviceId: string,
  port: number
) {
  const adbServer = spawn('adb', ['connect', `localhost:${port}`]);
  const {
    server: { logsToFile },
  } = getGenericStorage();

  adbServer.stdout.on('data', (data) => {
    const isAdbConnected = data.toString().match(/(connected to localhost:)/);

    // Write logs to file if needed
    if (logsToFile) {
      writeDataToFile(`${deviceId}.log`, data);
    }

    // Store the logs
    dispatch(deviceSessionStoreLog(deviceId, data));

    if (isAdbConnected) {
      // Update the store that the device is automatically connected
      dispatch(deviceSessionStoreAdbConnectedStatus(deviceId, true));
      // Store it to the server logs instead of the devices logs
      storeAdbConnectedDeviceLog(dispatch);
    }
  });
  // @TODO: add error,but have never seen this go wrong
}

function connectToDeviceSession(
  dispatch: DispatchType,
  deviceId: string,
  sessionID: string
) {
  const {
    connection: { username, accessKey },
    device: {
      proxy: {
        host: deviceHost,
        port: devicePort,
        username: deviceUsername,
        password: devicePassword,
      },
    },
    server: { autoAdbConnect, host: serverHost, logsToFile, port: serverPort },
  } = getGenericStorage();
  const deviceArgs = [
    '-jar',
    getVusbFilePath(),
    'connect',
    '--username',
    username,
    '--accessKey',
    accessKey,
    '--sessionId',
    sessionID,
    '--serverHost',
    serverHost,
    '--serverPort',
    serverPort,
  ];

  // Add proxy args
  if (deviceHost) {
    deviceArgs.push('--proxyHost', deviceHost);
  }

  if (devicePort) {
    deviceArgs.push('--proxyPort', devicePort);
  }

  if (deviceUsername) {
    deviceArgs.push('--proxyUser', deviceUsername);
  }

  if (devicePassword) {
    deviceArgs.push('--proxyPassword', devicePassword);
  }

  // Write logs to file if needed
  if (logsToFile) {
    writeDataToFile(
      `${deviceId}.log`,
      `Starting device connection: 'java ${deviceArgs.join(' ')}'`
    );
  }

  // Start the device
  const deviceServerProcess: ChildProcess = spawn(
    'java',
    deviceArgs.map((arg) => arg.toString())
  );

  deviceServerProcess.stdout?.on('data', (data) => {
    const parsedData = data.toString();
    // @TODO: Need to find a better way for this to do
    const startingConnection = parsedData.match(
      /(INFO com.saucelabs.vusb.client.Runner - Runner Version|WARN com.saucelabs.vusb.client.util.AdbVersionCheck)/
    );
    const connectionError = parsedData.match(
      /(ERROR com.saucelabs.vusb.client.Runner)/
    );
    // iOS gives back `localhost:-1	online` instead of a port,
    // but this needs to be handled as a proper connection
    const iOSOnlinePort = parsedData.match(/(localhost:-1\s+online)/i);
    // Android gives back `localhost:7000	online` and needs to be added to the device details
    const androidPort = parsedData.match(/^(localhost:)(\d+)/i);

    // Write logs to file if needed
    if (logsToFile) {
      writeDataToFile(`${deviceId}.log`, data);
    }

    if (connectionError) {
      dispatch(deviceSessionError(deviceId, data));
    } else if (iOSOnlinePort) {
      dispatch(deviceSessionStorePort(deviceId, data, 0));
    } else if (androidPort) {
      const portNumber = parseInt(androidPort[2], 10);
      dispatch(deviceSessionStorePort(deviceId, data, portNumber));
      if (autoAdbConnect) {
        startAdbConnection(dispatch, deviceId, portNumber);
      }
    } else if (startingConnection) {
      dispatch(deviceSessionStart(deviceId, data));
    } else {
      dispatch(deviceSessionStoreLog(deviceId, data));
    }
  });

  deviceServerProcess.stderr?.on('data', (data) => {
    // Write logs to file if needed
    if (logsToFile) {
      writeDataToFile(`${deviceId}.log`, data);
    }

    dispatch(deviceSessionError(deviceId, data));
  });

  deviceServerProcess.on('close', () => {
    // @TODO: this is not needed to dispatch because it will cause confusion
  });
}

function stopAdbConnection(
  dispatch: DispatchType,
  deviceId: string,
  port: number
) {
  const adbServer = spawn('adb', ['disconnect', `localhost:${port}`]);
  const {
    server: { logsToFile },
  } = getGenericStorage();

  adbServer.stdout.on('data', (data) => {
    const isAdbDisconnected = data
      .toString()
      .match(/(disconnected localhost:)/);

    // Write logs to file if needed
    if (logsToFile) {
      writeDataToFile(`${deviceId}.log`, data);
    }

    // Store the logs
    dispatch(deviceSessionStoreLog(deviceId, data));

    if (isAdbDisconnected) {
      // Update the store that the device is automatically connected
      dispatch(deviceSessionStoreAdbConnectedStatus(deviceId, false));
      // Store it to the server logs instead of the devices logs
      storeAdbConnectedDeviceLog(dispatch);
    }
  });
  // @TODO: add error,but have never seen this go wrong
}

function disconnectDeviceSession({
  descriptorId,
  dispatch,
  port,
  sessionId,
  status,
}: {
  descriptorId: string;
  dispatch: DispatchType;
  port: number;
  sessionId: string;
  status: string;
}) {
  const {
    server: { autoAdbConnect, host: serverHost, logsToFile, port: serverPort },
  } = getGenericStorage();

  if (status !== DeviceSessionStatusEnum.CONNECTED) {
    return;
  }

  const deviceServerProcess: ChildProcess = spawn(
    'java',
    [
      '-jar',
      getVusbFilePath(),
      'disconnect',
      '--sessionId',
      sessionId,
      '--serverHost',
      serverHost,
      '--serverPort',
      serverPort,
    ].map((arg) => arg.toString())
  );

  deviceServerProcess.stdout?.on('data', (data) => {
    // Write logs to file if needed
    if (logsToFile) {
      writeDataToFile(`${descriptorId}.log`, data);
    }

    dispatch(deviceSessionStopping(descriptorId, data));
  });

  deviceServerProcess.stderr?.on('data', (data) => {
    // Write logs to file if needed
    if (logsToFile) {
      writeDataToFile(`${descriptorId}.log`, data);
    }

    dispatch(deviceSessionError(descriptorId, data));
  });

  deviceServerProcess.on('close', (code) => {
    dispatch(deviceSessionStopped(descriptorId, code.toString()));
    if (autoAdbConnect) {
      // Stop the ADB connection
      stopAdbConnection(dispatch, descriptorId, port);
    }
  });
}

export { disconnectDeviceSession, connectToDeviceSession, startAdbConnection };
