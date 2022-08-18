import { ChildProcess, spawn } from 'child_process';
import fixPath from 'fix-path';
import { join } from 'path';
import { writeFileSync } from 'fs';
import { SERVER_LOGS, VUSB_SERVER_NAME } from '../../renderer/utils/Constants';
import { ElectronStorageType } from '../../types/ElectronStoreTypes';
import { getLocalTimeString } from '../../renderer/utils/Helpers';
import { ServerActionEnum } from '../../types/ServerTypes';
import { ChannelsEnum } from '../../types/ChannelTypes';
import { sendDataToRenderer } from './helpers';

let serverProcess: ChildProcess | null = null;
fixPath();

/**
 * Get the vusb-runner path for a debug/release version
 */
function getVusbFilePath(): string {
  const runner = VUSB_SERVER_NAME;

  return process.env.NODE_ENV === 'development'
    ? join(__dirname, '../../../', 'assets', runner)
    : join(process.resourcesPath, 'assets', runner);
}

/**
 * Write data to a file
 */
function writeDataToFile(logsPath: string, fileName: string, data: string) {
  try {
    writeFileSync(join(logsPath, fileName), data, {
      flag: 'a',
    });
  } catch (err) {
    // @TODO: add a better way to handle this
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

/**
 * Start the vUSB server
 */
function startServer(
  event: Electron.IpcMainEvent,
  genericStorage: ElectronStorageType,
  status: ServerActionEnum
) {
  const {
    connection,
    server: {
      adbPortMin: serverAdbPortMin,
      adbPortRange: serverAdbPortRange,
      host: serverHost,
      logsPath,
      logsToFile,
      portNumber: serverPort,
      verboseLogs,
    },
    proxy,
  } = genericStorage;

  if (
    status === ServerActionEnum.VUSB_IDLE ||
    status === ServerActionEnum.VUSB_STOPPED ||
    status !== ServerActionEnum.VUSB_STARTING
  ) {
    let newVusbStatus: ServerActionEnum = status;

    // Return that the server is going to start
    const startMessage = `\n
${getLocalTimeString()} [main] INFO Starting the vUSB server.`;
    sendDataToRenderer({
      event,
      channel: ChannelsEnum.VUSB_SERVER_START,
      data: { logLine: startMessage, status: ServerActionEnum.VUSB_STARTING },
    });

    const serverArgs = [
      '-jar',
      getVusbFilePath(),
      '-v',
      'server',
      '--datacenter',
      connection.location.toUpperCase(),
      '--serverHost',
      serverHost,
      '--serverPort',
      serverPort,
      '--adbPortMin',
      serverAdbPortMin,
      '--adbPortRange',
      serverAdbPortRange,
    ];

    if (!verboseLogs) {
      serverArgs.splice(serverArgs.indexOf('-v'), 1);
    }

    // Add proxy args
    const { host, portNumber, username, password } = proxy;
    if (host) {
      serverArgs.push('--proxyHost', host);
    }

    if (portNumber) {
      serverArgs.push('--proxyPort', portNumber);
    }

    if (username) {
      serverArgs.push('--proxyUser', username);
    }

    if (password) {
      serverArgs.push('--proxyPassword', password);
    }

    const argumentsMessage = `${getLocalTimeString()} [main] INFO Using the following arguments: 'java ${serverArgs.join(
      ' '
    )}'\n`;
    const startServerMessage = `${startMessage}\n${argumentsMessage}`;

    sendDataToRenderer({
      event,
      channel: ChannelsEnum.VUSB_SERVER_START,
      data: {
        logLine: argumentsMessage,
        status: ServerActionEnum.VUSB_STARTING,
      },
    });
    // Set it to starting
    newVusbStatus = ServerActionEnum.VUSB_STARTING;

    // Write logs to file if needed
    if (logsToFile) {
      writeDataToFile(logsPath, SERVER_LOGS, startServerMessage);
    }

    // Start the server
    serverProcess = spawn(
      'java',
      serverArgs.map((arg) => arg.toString())
    );
    serverProcess?.stdout?.on('data', (data) => {
      // @TODO: Need to find a better way for this to do
      const isStarted = data.toString().match(/(Virtual USB server is up)/);
      const isStarting = data
        .toString()
        .match(/(Runner launched with command)/);
      const isError = data
        .toString()
        .match(
          /(Exception during vUSB-Server|Cannot start Virtual USB server)/
        );
      const isStopping = data
        .toString()
        .match(/(Shutting down vUSB-Server|Stopping TcpServerManager)/);
      const isStopped = data.toString().match(/(vUSB-Server shut down)/);

      // Write logs to file if needed
      if (logsToFile) {
        writeDataToFile(logsPath, SERVER_LOGS, data);
      }

      if (isStarting) {
        newVusbStatus = ServerActionEnum.VUSB_STARTING;
      }
      if (isStarted) {
        newVusbStatus = ServerActionEnum.VUSB_RUNNING;
      }
      if (isError) {
        newVusbStatus = ServerActionEnum.VUSB_ERROR;
      }
      if (isStopping) {
        newVusbStatus = ServerActionEnum.VUSB_STOPPING;
      }
      if (isStopped) {
        newVusbStatus = ServerActionEnum.VUSB_STOPPED;
      }

      return sendDataToRenderer({
        event,
        channel: ChannelsEnum.VUSB_SERVER_START,

        data: { logLine: data, status: newVusbStatus },
      });
    });

    serverProcess?.stderr?.on('data', (data) => {
      // Write logs to file if needed
      if (logsToFile) {
        writeDataToFile(logsPath, SERVER_LOGS, data);
      }

      sendDataToRenderer({
        event,
        channel: ChannelsEnum.VUSB_SERVER_START,
        data: { logLine: data, status: ServerActionEnum.VUSB_ERROR },
      });
    });

    serverProcess?.on('close', () => {
      sendDataToRenderer({
        event,
        channel: ChannelsEnum.VUSB_SERVER_START,
        data: {
          logLine: `${getLocalTimeString()} [main] INFO Server back to idle.`,
          status: ServerActionEnum.VUSB_IDLE,
        },
      });
    });
  }
}

/**
 * Stop the running server
 *
 * @TODO: It could also fail because of a not attached session, just check if this can happen in the production app
 * @TODO: create a better solution for the alert to stop the server
 */
function stopServer(event: Electron.IpcMainEvent) {
  if (serverProcess) {
    serverProcess.kill();
    sendDataToRenderer({
      event,
      channel: ChannelsEnum.VUSB_SERVER_STOP,
      data: {
        logLine: `${getLocalTimeString()} [main] INFO Server has been stopped by pressing the Stop-button.`,
        status: ServerActionEnum.VUSB_STOP,
      },
    });
  }
}

/**
 * Get the connected ADB devices
 */
// function storeAdbConnectedDeviceLog(dispatch: DispatchType) {
//   const adbServer = spawn('adb', ['devices', '-l']);

//   adbServer.stdout.on('data', (data) => dispatch(vusbServerLogAdbAction(data)));
//   // @TODO: add error,but have never seen this go wrong
// }

export {
  startServer,
  // storeAdbConnectedDeviceLog,
  stopServer,
};
