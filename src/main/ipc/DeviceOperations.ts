/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { ChildProcess, spawn } from 'child_process';
import { getLocalTimeString } from '../../renderer/utils/Helpers';
import {
  CreateDeviceConnectionType,
  DeviceSessionStatusEnum,
  StopDeviceType,
} from '../../types/DeviceTypes';
import { ElectronStorageType } from '../../types/ElectronStoreTypes';
import { getVusbFilePath, writeDataToFile } from './helpers';

/**
 * Spawn the vusb command
 */
async function spawnAdbCommand({
  adbArgs,
  descriptorId,
  logsPath,
  logsToFile,
  message,
}: {
  adbArgs: string[];
  descriptorId: string;
  logsPath: string;
  logsToFile: boolean;
  message: string;
}): Promise<string[]> {
  try {
    return await new Promise((resolve, reject) => {
      const result: string[] = [];
      const errorMessage: string[] = [];
      const startMessage = `${getLocalTimeString()} [main] INFO ${message}`;
      const argumentsMessage = `${getLocalTimeString()} [main] INFO Using the following arguments: 'adb ${adbArgs.join(
        ' '
      )}'`;
      const adbProcess: ChildProcess = spawn(
        'adb',
        adbArgs.map((arg) => (arg as string | number).toString())
      );

      result.push(startMessage, argumentsMessage);

      adbProcess.stdout?.on('data', (data) => {
        result.push(data.toString('utf-8'));
      });
      adbProcess.stderr?.on('data', (data) => {
        errorMessage.push(data.toString('utf-8'));
      });
      adbProcess.on('error', (error) => {
        errorMessage.push(error.toString());
        reject(errorMessage);
      });
      adbProcess.on('close', () => {
        // Write logs to file if needed
        if (logsToFile) {
          writeDataToFile(logsPath, `${descriptorId}.log`, result.join('\n'));
        }
        resolve(result);
      });
    });
  } catch (error) {
    return [
      `${getLocalTimeString()} [main] ERROR com.saucelabs.vusb.client.Runner ${error}`,
    ];
  }
}

/**
 * Start the ADB connection
 */
async function startAdbConnection({
  descriptorId,
  logsPath,
  logsToFile,
  port,
}: {
  descriptorId: string;
  logsPath: string;
  logsToFile: boolean;
  port: number;
}): Promise<string[]> {
  const adbArgs = ['connect', `localhost:${port}`];
  const message = 'Automatically connecting to ADB';
  const adbResult = await spawnAdbCommand({
    descriptorId,
    adbArgs,
    logsPath,
    logsToFile,
    message,
  });

  return adbResult;
}

/**
 * Stop the ADB connection
 */
async function stopAdbConnection({
  descriptorId,
  logsPath,
  logsToFile,
  port,
}: {
  descriptorId: string;
  logsPath: string;
  logsToFile: boolean;
  port: number;
}): Promise<string[]> {
  const adbArgs = ['disconnect', `localhost:${port}`];
  const message = `Automatically stopping the ADB connection on port:'${port}'`;
  const adbResult = await spawnAdbCommand({
    descriptorId,
    adbArgs,
    logsPath,
    logsToFile,
    message,
  });

  return adbResult;
}

/**
 * Get the device connections arguments to start connecting to an existing session
 */
function getDeviceConnectArgs({
  sessionId,
  storageData,
}: {
  sessionId: string;
  storageData: ElectronStorageType;
}): string[] {
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
    server: { host: serverHost, port: serverPort },
  } = storageData;
  const deviceArgs = [
    '-jar',
    getVusbFilePath(),
    'connect',
    '--username',
    username,
    '--accessKey',
    accessKey,
    '--sessionId',
    sessionId,
    '--serverHost',
    serverHost,
    '--serverPort',
    serverPort.toString(),
  ];

  // Add proxy args
  if (deviceHost) {
    deviceArgs.push('--proxyHost', deviceHost);
  }

  if (devicePort) {
    deviceArgs.push('--proxyPort', devicePort.toString());
  }

  if (deviceUsername) {
    deviceArgs.push('--proxyUser', deviceUsername);
  }

  if (devicePassword) {
    deviceArgs.push('--proxyPassword', devicePassword);
  }

  return deviceArgs;
}

/**
 * Get the device start connect arguments to start a new session
 */
function getStartDeviceConnectArgs({
  descriptorId,
  storageData,
  tunnelIdentifier,
}: {
  descriptorId: string;
  storageData: ElectronStorageType;
  tunnelIdentifier: string | null;
}): string[] {
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
    server: { host: serverHost, port: serverPort },
  } = storageData;
  const deviceArgs = [
    '-jar',
    getVusbFilePath(),
    'startSession',
    '--username',
    username,
    '--accessKey',
    accessKey,
    '--deviceName',
    descriptorId,
    '--serverHost',
    serverHost,
    '--serverPort',
    serverPort.toString(),
  ];

  if (tunnelIdentifier) {
    deviceArgs.push('--tunnelIdentifier', tunnelIdentifier);
  }

  // Add proxy args
  if (deviceHost) {
    deviceArgs.push('--proxyHost', deviceHost);
  }

  if (devicePort) {
    deviceArgs.push('--proxyPort', devicePort.toString());
  }

  if (deviceUsername) {
    deviceArgs.push('--proxyUser', deviceUsername);
  }

  if (devicePassword) {
    deviceArgs.push('--proxyPassword', devicePassword);
  }

  return deviceArgs;
}

/**
 * Get the device disconnect arguments to start disconnecting from or killing the session
 */
function getDeviceDisconnectArgs({
  manualConnect,
  sessionId,
  storageData,
}: {
  manualConnect: boolean;
  sessionId: string;
  storageData: ElectronStorageType;
}): string[] {
  const {
    server: { host: serverHost, port: serverPort },
  } = storageData;
  const deviceArgs = [
    '-jar',
    getVusbFilePath(),
    manualConnect ? 'deleteSession' : 'disconnect',
    '--sessionId',
    sessionId,
    '--serverHost',
    serverHost,
    '--serverPort',
    serverPort.toString(),
  ];

  return deviceArgs;
}

/**
 * Spawn the vusb command
 */
async function spawnVusbCommand({
  descriptorId,
  deviceArgs,
  logsPath,
  logsToFile,
  message,
}: {
  deviceArgs: string[];
  descriptorId: string;
  logsPath: string;
  logsToFile: boolean;
  message: string;
}): Promise<string[]> {
  try {
    return await new Promise((resolve, reject) => {
      const result: string[] = [];
      const errorMessage: string[] = [];
      const startMessage = `${getLocalTimeString()} [main] INFO ${message}`;
      const argumentsMessage = `${getLocalTimeString()} [main] INFO Using the following arguments: 'java ${deviceArgs.join(
        ' '
      )}'`;
      const deviceServerProcess: ChildProcess = spawn(
        'java',
        deviceArgs.map((arg) => (arg as string | number).toString())
      );

      result.push(startMessage, argumentsMessage);

      deviceServerProcess.stdout?.on('data', (data) => {
        result.push(data.toString('utf-8'));
      });
      deviceServerProcess.stderr?.on('data', (data) => {
        result.push(data.toString());
        errorMessage.push(data.toString('utf-8'));
      });
      deviceServerProcess.on('error', (error) => {
        result.push(error.toString());
        errorMessage.push(error.toString());
        reject(errorMessage);
      });
      deviceServerProcess.on('close', () => {
        // Write logs to file if needed
        if (logsToFile) {
          writeDataToFile(logsPath, `${descriptorId}.log`, result.join('\n'));
        }
        resolve(result);
      });
    });
  } catch (error) {
    return [
      `${getLocalTimeString()} [main] ERROR com.saucelabs.vusb.client.Runner ${error}`,
    ];
  }
}

/**
 * Connect to an existing devices session
 */
async function connectToExistingDevice({
  descriptorId,
  sessionId,
  storageData,
}: {
  descriptorId: string;
  sessionId: string;
  storageData: ElectronStorageType;
}): Promise<string[]> {
  const {
    server: { logsPath, logsToFile },
  } = storageData;
  const deviceArgs = getDeviceConnectArgs({ sessionId, storageData });
  const spawnData = await spawnVusbCommand({
    descriptorId,
    deviceArgs,
    logsPath,
    logsToFile,
    message: `Starting to connect to a device with the following deviceId: '${descriptorId}'`,
  });

  return spawnData;
}

/**
 * Start a new devices session
 */
async function startNewDeviceConnection({
  descriptorId,
  storageData,
  tunnelIdentifier,
}: {
  descriptorId: string;
  storageData: ElectronStorageType;
  tunnelIdentifier: string | null;
}): Promise<string[]> {
  const {
    server: { logsPath, logsToFile },
  } = storageData;
  const deviceArgs = getStartDeviceConnectArgs({
    descriptorId,
    storageData,
    tunnelIdentifier,
  });
  const spawnData = await spawnVusbCommand({
    descriptorId,
    deviceArgs,
    logsPath,
    logsToFile,
    message: `Starting a new device connection with the following deviceId: '${descriptorId}'`,
  });

  return spawnData;
}

/**
 * Close the device connection
 */
async function closeDeviceConnection({
  descriptorId,
  manualConnect,
  sessionId,
  status,
  storageData,
}: StopDeviceType): Promise<string[]> {
  const {
    server: { logsPath, logsToFile },
  } = storageData;
  const message = manualConnect
    ? `Stopping the device connection and killing the session for the following deviceId: '${descriptorId}'`
    : `Stopping the device connection for the following deviceId: '${descriptorId}'`;

  if (status !== DeviceSessionStatusEnum.CONNECTED) {
    return [
      '[main] ERROR com.saucelabs.vusb.client.Runner, device is not connected anymore',
    ];
  }

  const deviceArgs = getDeviceDisconnectArgs({
    manualConnect,
    sessionId,
    storageData,
  });
  const spawnData = await spawnVusbCommand({
    descriptorId,
    deviceArgs,
    logsPath,
    logsToFile,
    message,
  });

  return spawnData;
}

/**
 * Connect vUSB to the already existing device session on Sauce Labs
 */
async function connectToDeviceSession({
  descriptorId,
  sessionId,
  storageData,
}: {
  descriptorId: string;
  sessionId: string;
  storageData: ElectronStorageType;
}): Promise<CreateDeviceConnectionType> {
  const {
    server: { autoAdbConnect, logsPath, logsToFile },
  } = storageData;
  const deviceConnectionData = await connectToExistingDevice({
    descriptorId,
    sessionId,
    storageData,
  });
  const connectionResponse = {
    adbConnected: false,
    connectionError: false,
    connectionUrl: '',
    logLines: deviceConnectionData.map((line) => line.replace('\n', '')),
    manualConnect: false,
    portNumber: 0,
    sessionId,
  };

  for (const line of deviceConnectionData) {
    // Parse the log lines
    const connectionError = line.match(
      /(ERROR com.saucelabs.vusb.client.Runner)/
    );
    // iOS gives back `localhost:-1	online` instead of a port,
    const iOSOnlinePort = line.match(/(localhost:-1\s+online)/i);
    // Android gives back `localhost:{number}\tonline` and needs to be added to the device details
    const androidPort = line.match(/^(localhost:)(\d+)/i);

    if (connectionError) {
      connectionResponse.connectionError = true;
    }
    if (iOSOnlinePort) {
      connectionResponse.portNumber = -1;
    }
    if (androidPort) {
      connectionResponse.portNumber = parseInt(androidPort[2], 10);
      if (autoAdbConnect) {
        const adbConnectionData = await startAdbConnection({
          descriptorId,
          logsPath,
          logsToFile,
          port: connectionResponse.portNumber,
        });
        for (const adbLine of adbConnectionData) {
          if (adbLine.match(/(connected to localhost:)/)) {
            connectionResponse.adbConnected = true;
          }
        }
        connectionResponse.logLines.push(...adbConnectionData);
      }
    }
  }

  return {
    ...connectionResponse,
    logLines: connectionResponse.logLines.join('\n'),
  };
}

/**
 * Use vUSB to start a new device session on Sauce Labs
 */
async function startNewDeviceSession({
  descriptorId,
  storageData,
  tunnelIdentifier,
}: {
  descriptorId: string;
  storageData: ElectronStorageType;
  tunnelIdentifier: string | null;
}): Promise<CreateDeviceConnectionType> {
  const {
    server: { autoAdbConnect, logsPath, logsToFile },
  } = storageData;
  const deviceConnectionData = await startNewDeviceConnection({
    descriptorId,
    storageData,
    tunnelIdentifier,
  });
  const connectionResponse = {
    adbConnected: false,
    connectionError: false,
    connectionUrl: '',
    logLines: deviceConnectionData.map((line) => line.replace('\n', '')),
    manualConnect: true,
    portNumber: 0,
    sessionId: '',
  };

  for (const line of deviceConnectionData) {
    // Parse the log lines
    const connectionError = line.match(
      /(ERROR com.saucelabs.vusb.client.Runner)/
    );
    // iOS gives back `localhost:-1	online` instead of a port,
    // but this needs to be handled as a proper connection. We will keep the port as default 0.
    //
    // Android gives back `localhost:{number}\tonline` and needs to be added to the device details
    const androidPort = line.match(/^(localhost:)(\d+)/i);
    const sessionIDFromLog = line.match(
      /^[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+/i
    );

    if (sessionIDFromLog) {
      connectionResponse.sessionId = sessionIDFromLog[0];
    }

    if (connectionError) {
      connectionResponse.connectionError = true;
      connectionResponse.manualConnect = false;
    }
    if (androidPort) {
      connectionResponse.portNumber = parseInt(androidPort[2], 10);
      if (autoAdbConnect) {
        const adbConnectionData = await startAdbConnection({
          descriptorId,
          logsPath,
          logsToFile,
          port: connectionResponse.portNumber,
        });
        for (const adbLine of adbConnectionData) {
          if (adbLine.match(/(connected to localhost:)/)) {
            connectionResponse.adbConnected = true;
          }
        }
        connectionResponse.logLines.push(...adbConnectionData);
      }
    }
  }

  return {
    ...connectionResponse,
    logLines: connectionResponse.logLines.join('\n'),
  };
}

/**
 * Start the device connection, determine if it needs to start a
 * new session or connect to an existing one
 */
async function createDeviceConnection({
  descriptorId,
  sessionId,
  storageData,
  tunnelIdentifier,
}: {
  descriptorId: string;
  sessionId: string | null;
  storageData: ElectronStorageType;
  tunnelIdentifier: string | null;
}): Promise<CreateDeviceConnectionType> {
  if (sessionId) {
    const result = await connectToDeviceSession({
      descriptorId,
      sessionId,
      storageData,
    });

    return result;
  }

  return startNewDeviceSession({ descriptorId, storageData, tunnelIdentifier });
}

/**
 * Stop a vUSB connection to a device on Sauce Labs
 */
async function stopDeviceSession({
  descriptorId,
  manualConnect,
  port,
  sessionId,
  status,
  storageData,
}: StopDeviceType): Promise<{
  connectionError: boolean;
  connectionUrl: string;
  logLines: string;
  portNumber: number;
}> {
  const {
    server: { autoAdbConnect, logsPath, logsToFile },
  } = storageData;
  const deviceDisconnectionData = await closeDeviceConnection({
    descriptorId,
    manualConnect,
    port,
    sessionId,
    status,
    storageData,
  });
  const connectionResponse = {
    adbConnected: false,
    connectionError: false,
    connectionUrl: '',
    logLines: deviceDisconnectionData.map((line) => line.replace('\n', '')),
    portNumber: 0,
  };

  for (const line of deviceDisconnectionData) {
    // Parse the log lines
    const connectionError = line.match(
      /(ERROR com.saucelabs.vusb.client.Runner)/
    );

    if (connectionError) {
      connectionResponse.connectionError = true;
    }
  }

  if (autoAdbConnect && port >= 0) {
    const adbConnectionData = await stopAdbConnection({
      descriptorId,
      logsPath,
      logsToFile,
      port,
    });
    for (const adbLine of adbConnectionData) {
      if (adbLine.match(/(disconnected localhost:)/)) {
        connectionResponse.adbConnected = false;
      }
    }
    connectionResponse.logLines.push(...adbConnectionData);
  }

  return {
    ...connectionResponse,
    logLines: connectionResponse.logLines.join('\n'),
  };
}

export { createDeviceConnection, stopDeviceSession };
