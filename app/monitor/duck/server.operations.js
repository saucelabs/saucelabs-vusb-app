import { spawn } from 'child_process';
import fixPath from 'fix-path';
import {
  VUSB_SERVER_STATUS,
  vusbServerError,
  vusbServerLogAdb,
  vusbServerRunning,
  vusbServerStart,
  vusbServerStarting,
  vusbServerStop,
  vusbServerStopped,
  vusbServerStopping
} from './actions';
import { getVusbFilePath, writeDataToFile } from '../../helpers/utils';
import { getGenericStorage } from '../../settings/duck/settings.storage';
import { SERVER_LOGS } from '../../helpers/constants';

let serverProcess = null;
fixPath();

export function startServer() {
  return (dispatch, getState) => {
    const serverStatus = getState().server.status;
    const { connection, server, proxy } = getGenericStorage();

    if (
      serverStatus === VUSB_SERVER_STATUS.IDLE ||
      serverStatus === VUSB_SERVER_STATUS.STOPPED ||
      serverStatus !== VUSB_SERVER_STATUS.STARTING
    ) {
      dispatch(vusbServerStart());

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
        server.adb_port_min,
        '--adbPortRange',
        server.adb_port_range
      ];

      if (server.verbose_logs === 'off') {
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
      if (server.logs_to_file) {
        writeDataToFile(SERVER_LOGS, startServerMessage);
      }

      // Start the server
      serverProcess = spawn('java', serverArgs);

      serverProcess.stdout.on('data', (data) => {
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
        if (server.logs_to_file) {
          writeDataToFile(SERVER_LOGS, data);
        }

        if (isStarted || isStarting) {
          return dispatch(vusbServerStarting(data));
        }
        if (isError) {
          return dispatch(vusbServerError(data));
        }
        if (isStopped) {
          return dispatch(vusbServerStopped(data));
        }
        if (isStopping) {
          return dispatch(vusbServerStopping(data));
        }

        return dispatch(vusbServerRunning(data));
      });

      serverProcess.stderr.on('data', (data) => {
        // Write logs to file if needed
        if (server.logs_to_file) {
          writeDataToFile(SERVER_LOGS, data);
        }

        dispatch(vusbServerError(data));
      });

      serverProcess.on('close', (data) => {
        dispatch(vusbServerStopped(data));
      });
    }
  };
}

/**
 * Stop the running server
 *
 * @TODO: It could also fail because of a not attached session, just check if this can happen in the production app
 * @TODO: create a better solution for the alert to stop the server
 *
 * @returns {Function}
 */
export function stopServer() {
  return (dispatch) => {
    if (window.confirm('Are you sure you want to stop the vUSB server?')) {
      dispatch(vusbServerStop('Server stopped by pressing the button'));
      if (serverProcess) {
        serverProcess.stdin.pause();
        serverProcess.kill();
      }
    }
  };
}

/**
 * Get the connected ADB devices
 *
 * @param {function} dispatch
 */
export function storeAdbConnectedDevicesLog(dispatch) {
  const adbServer = spawn('adb', ['devices', '-l']);

  adbServer.stdout.on('data', (data) => {
    dispatch(vusbServerLogAdb(data));
  });
  // @TODO: add error,but have never seen this go wrong
}
