import { join } from 'path';
import { remote } from 'electron';
import { writeFileSync } from 'fs';
import axios from 'axios';
import semver from 'semver';
import { getGenericStorage } from '../settings/duck/settings.storage';
import { APP_VERSION, DATA_CENTER_URLS, VUSB_SERVER_NAME } from './constants';
import { isWindows } from './checks';

const { BrowserWindow, BrowserView } = remote;

export function getVusbFilePath() {
  const runner = VUSB_SERVER_NAME;

  return process.env.NODE_ENV === 'development'
    ? join(__dirname, '..', 'resources', 'runners', runner)
    : join(process.resourcesPath, 'runners', runner);
}

/**
 * Open the device window
 *
 * @param {object} data
 * @param {string} data.dc
 * @param {string} data.sessionID
 * @param {string} data.platform
 * @param {string} data.platform
 * @param {string} data.tokenId
 * @param {string} data.deviceName
 * @param {function} data.closeSession
 */
export function openDeviceWindow({
  dc,
  sessionID,
  platform,
  tokenId,
  deviceName,
  closeSession
}) {
  // Window of the device
  let deviceWindow = new BrowserWindow({
    width: 900,
    minWidth: 900,
    height: 680,
    minHeight: 680,
    webPreferences: {
      nodeIntegration: false,
      webSecurity: true
    }
  });

  // Add a small browser view on top of the device window to add the menu
  let menuView = new BrowserView({
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: true,
      additionalArguments: [
        '--openDevice',
        `--sessionID=${sessionID}`,
        `--platform=${platform}`
      ]
    }
  });
  deviceWindow.setBrowserView(menuView);
  // The coordinates where it needs to be placed
  const menuBarPosition = isWindows() ? 814 : 829;
  menuView.setBounds({ x: menuBarPosition, y: 0, width: 70, height: 1080 });
  menuView.setBackgroundColor('#fff');
  menuView.webContents.loadURL(`file://${__dirname}/app.html`);
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    menuView.webContents.openDevTools();
  }
  // EU will be:
  // https://app.eu-central-1.saucelabs.com/live/mobile/dataCenters/EU/devices/{deviceName}/shared/{sessionID}
  // US will be:
  // https://app.saucelabs.com/live/mobile/dataCenters/US/devices/{deviceName}/shared/{sessionID}
  const dcUrl = dc === 'us' ? '' : `${DATA_CENTER_URLS[dc]}.`;
  const url = `https://app.${dcUrl}saucelabs.com/live/mobile/dataCenters/${dc.toUpperCase()}/devices/${deviceName}/shared/${sessionID}`;
  deviceWindow.loadURL(url);

  // Set the cookie on the window
  const cookie = {
    url,
    name: 'sl-auth',
    value: tokenId,
    domain: '.saucelabs.com',
    path: '/'
  };
  deviceWindow.webContents.session.cookies.set(cookie);

  // Keep the bar on the right when the page is being resized
  deviceWindow.on('resize', () => {
    const { width } = deviceWindow.getBounds();
    const newMenuBarPosition = width - (isWindows() ? 84 : 70);
    menuView.setBounds({
      x: newMenuBarPosition,
      y: 0,
      width: 70,
      height: 1080
    });
  });

  deviceWindow.on('closed', () => {
    deviceWindow = null;
    menuView = null;
    closeSession(deviceName);
  });
}

/**
 * Write data to a file
 *
 * @param {string} fileName
 * @param {string} data
 */
export function writeDataToFile(fileName, data) {
  try {
    writeFileSync(join(getGenericStorage().server.logs_path, fileName), data, {
      flag: 'a'
    });
  } catch (err) {
    console.error(err);
  }
}

/**
 * Check if the GUI is still up to date
 *
 * @returns {Promise<{deprecated: boolean, update: boolean}>}
 */
export async function getGuiVersions() {
  try {
    const result = await axios.get(
      'https://raw.githubusercontent.com/saucelabs/saucelabs-vusb-app/main/versions.json'
    );
    const { active, deprecated } = result.data;

    return {
      update: semver.gt(active, APP_VERSION),
      deprecated: deprecated.includes(APP_VERSION)
    };
  } catch (error) {
    return {
      update: false,
      deprecated: false
    };
  }
}
