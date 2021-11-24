import { join } from 'path';
import { writeFileSync } from 'fs';
import axios from 'axios';
import semver from 'semver';
import { APP_VERSION, MAX_LOG_LINES, VUSB_SERVER_NAME } from './Constants';
import { getGenericStorage } from '../settings/SettingsStorage';

/**
 * Get the vusb-runner path for a debug/release version
 */
function getVusbFilePath(): string {
  const runner = VUSB_SERVER_NAME;

  return process.env.NODE_ENV === 'development'
    ? join(__dirname, '..', 'assets', runner)
    : join(process.resourcesPath, 'assets', runner);
}

/**
 * Write data to a file
 */
function writeDataToFile(fileName: string, data: string) {
  try {
    writeFileSync(join(getGenericStorage().server.logsPath, fileName), data, {
      flag: 'a',
    });
  } catch (err) {
    // @TODO: add a better way to handle this
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

/**
 * Trim the log array to the MAX_LOG_LINES
 */
function trimLogArray(logLines: string[]): string[] {
  if (logLines.length > MAX_LOG_LINES) {
    return logLines.slice(logLines.length - MAX_LOG_LINES);
  }

  return logLines;
}

/**
 * Get a local time string like 'hh:mm:ss.SSS'
 */
function getLocalTimeString(): string {
  const d = new Date();

  return `${d.toLocaleTimeString()}.${String(d.getMilliseconds()).padStart(
    3,
    '0'
  )}`;
}

/**
 * Check if the GUI is still up to date
 */
async function getGuiVersions(): Promise<{
  deprecated: boolean;
  update: boolean;
}> {
  try {
    const result = await axios.get(
      'https://raw.githubusercontent.com/saucelabs/saucelabs-vusb-app/main/versions.json'
    );
    const { active, deprecated } = result.data;

    return {
      deprecated: deprecated.includes(APP_VERSION),
      update: semver.gt(active, APP_VERSION),
    };
  } catch (error) {
    return {
      deprecated: false,
      update: false,
    };
  }
}

export {
  getGuiVersions,
  getLocalTimeString,
  getVusbFilePath,
  trimLogArray,
  writeDataToFile,
};
