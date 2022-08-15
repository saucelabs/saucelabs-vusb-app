import { writeFileSync } from 'fs';
import { join } from 'path';
import { VUSB_SERVER_NAME } from '../../renderer/utils/Constants';
import { ChannelsEnum } from '../../types/ChannelTypes';
import { DeviceActionEnum } from '../../types/DeviceTypes';
import { ServerActionEnum } from '../../types/ServerTypes';

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
 * Send data from the server to the renderer process
 */
function sendDataToRenderer({
  event,
  channel,
  data: { descriptorId, logLine, port, status },
}: {
  event: Electron.IpcMainEvent;
  channel: ChannelsEnum;
  data: {
    descriptorId?: string;
    logLine: Buffer | string;
    port?: number;
    status: ServerActionEnum | DeviceActionEnum;
  };
}) {
  event.reply(channel, {
    ...(descriptorId ? { descriptorId } : {}),
    logLine:
      typeof logLine === 'string'
        ? logLine
        : new TextDecoder('utf-8').decode(logLine),
    ...(port ? { port } : {}),
    status,
  });
}

export { getVusbFilePath, sendDataToRenderer, writeDataToFile };
