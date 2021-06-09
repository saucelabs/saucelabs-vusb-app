import { ChildProcess, spawn } from 'child_process';
import fixPath from 'fix-path';
import {
  getLocalTimeString,
  getVusbFilePath,
  writeDataToFile,
} from '../utils/Helpers';
import {
  VUSB_SERVER_STATUS,
  vusbServerErrorAction,
  vusbServerIdleAction,
  vusbServerLogAdbAction,
  vusbServerRunningAction,
  vusbServerStartAction,
  vusbServerStartingAction,
  vusbServerStopAction,
  vusbServerStoppedAction,
  vusbServerStoppingAction,
} from '../store/actions/ServerActions';
import { SERVER_LOGS } from '../utils/Constants';
import { getGenericStorage } from '../settings/SettingsStorage';
import { DispatchType } from '../types/StoreTypes';

let serverProcess: ChildProcess | null = null;
fixPath();

/**
 * Start the vUSB server
 */
function startServer(dispatch: DispatchType, status: string) {
  const { connection, server, proxy } = getGenericStorage();

  if (
    status === VUSB_SERVER_STATUS.IDLE ||
    status === VUSB_SERVER_STATUS.STOPPED ||
    status !== VUSB_SERVER_STATUS.STARTING
  ) {
    dispatch(
      vusbServerStartAction(
        new TextEncoder().encode(
          `${getLocalTimeString()} [main] INFO Starting the vUSB server.`
        )
      )
    );

    const serverArgs = [
      '-jar',
      getVusbFilePath(),
      '-v',
      'server',
      '--datacenter',
      connection.location.toUpperCase(),
      '--serverHost',
      server.host,
      '--serverPort',
      server.port,
      '--adbPortMin',
      server.adbPortMin,
      '--adbPortRange',
      server.adbPortRange,
    ];

    // if (server.verboseLogs === 'off') {
    if (!server.verboseLogs) {
      serverArgs.splice(serverArgs.indexOf('-v'), 1);
    }

    // Add proxy args
    const { host, port, username, password } = proxy;
    if (host) {
      serverArgs.push('--proxyHost', host);
    }

    if (port) {
      serverArgs.push('--proxyPort', port);
    }

    if (username) {
      serverArgs.push('--proxyUser', username);
    }

    if (password) {
      serverArgs.push('--proxyPassword', password);
    }

    const startServerMessage = `Starting vUSB server: 'java ${serverArgs.join(
      ' '
    )}'`;

    // Write logs to file if needed
    if (server.logsToFile) {
      writeDataToFile(SERVER_LOGS, startServerMessage);
    }

    // Start the server
    serverProcess = spawn('java', serverArgs);

    serverProcess.stdout?.on('data', (data) => {
      // @TODO: Need to find a better way for this to do
      const isStarted = data.toString().match(/(Runner Version)/);
      const isStarting = data
        .toString()
        .match(/(Runner launched with command)/);
      const isError = data
        .toString()
        .match(
          /(Exception during vUSB-Server|Cannot start Virtual USB server)/
        );
      const isStopping = data.toString().match(/(Shutting down vUSB-Server)/);
      const isStopped = data.toString().match(/(vUSB-Server shut down)/);

      // Write logs to file if needed
      if (server.logsToFile) {
        writeDataToFile(SERVER_LOGS, data);
      }

      if (isStarted || isStarting) {
        return dispatch(vusbServerStartingAction(data));
      }
      if (isError) {
        return dispatch(vusbServerErrorAction(data));
      }
      if (isStopping) {
        return dispatch(vusbServerStoppingAction(data));
      }
      if (isStopped) {
        return dispatch(vusbServerStoppedAction(data));
      }

      return dispatch(vusbServerRunningAction(data));
    });

    serverProcess.stderr?.on('data', (data) => {
      // Write logs to file if needed
      if (server.logsToFile) {
        writeDataToFile(SERVER_LOGS, data);
      }

      dispatch(vusbServerErrorAction(data));
    });

    serverProcess.on('close', () => {
      dispatch(
        vusbServerIdleAction(
          new TextEncoder().encode(
            `${getLocalTimeString()} [main] INFO Server back to idle.\n${getLocalTimeString()} [main] INFO ----------------------------------------------------------------------------------------------------`
          )
        )
      );
    });
  }
}

/**
 * Stop the running server
 *
 * @TODO: It could also fail because of a not attached session, just check if this can happen in the production app
 * @TODO: create a better solution for the alert to stop the server
 */
function stopServer(dispatch: DispatchType, connectedDevices: string[]) {
  // eslint-disable-next-line no-alert
  const connectionMessage =
    connectedDevices.length > 0 ? 'There are still devices connected! ' : '';
  if (
    window.confirm(
      `${connectionMessage}Are you sure you want to stop the vUSB server?`
    )
  ) {
    dispatch(
      vusbServerStopAction(
        new TextEncoder().encode(
          `${getLocalTimeString()} [main] INFO Server will stop by pressing the button.`
        )
      )
    );
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

/**
 * Get the connected ADB devices
 */
function storeAdbConnectedDeviceLog(dispatch: DispatchType) {
  const adbServer = spawn('adb', ['devices', '-l']);

  adbServer.stdout.on('data', (data) => dispatch(vusbServerLogAdbAction(data)));
  // @TODO: add error,but have never seen this go wrong
}

export { startServer, storeAdbConnectedDeviceLog, stopServer };
