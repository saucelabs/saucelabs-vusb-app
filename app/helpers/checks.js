import { platform } from 'os';
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import { spawnSync } from 'child_process';
import { remote } from 'electron';

export const SYSTEM_CHECKS = {
  JAVA_HOME: {
    ...EnvVarAndPathCheck('JAVA_HOME')
  },
  ANDROID_HOME: {
    ...EnvVarAndPathCheck('ANDROID_HOME')
  },
  ADB: {
    ...AndroidToolCheck(
      'adb',
      join('platform-tools', isWindows() ? 'adb.exe' : 'adb')
    )
  },
  XCODE: {
    ...(isMac()
      ? XcodeCheck()
      : {
          check: false,
          message: `${
            isLinux() ? 'Linux' : 'Windows'
          } does not support Virtual USB for iOS`
        })
  }
};

/**
 * Check if platform is Windows
 *
 * @returns {boolean}
 */
export function isWindows() {
  return platform().toLowerCase() === 'win32';
}

/**
 * Check if platform is OSX
 *
 * @returns {boolean}
 */
export function isMac() {
  return platform().toLowerCase() === 'darwin';
}

/**
 * Check if platform is Linux
 *
 * @returns {boolean}
 */
export function isLinux() {
  return platform().toLowerCase() === 'linux';
}

/**
 * Check if there is an Android error
 *
 * @returns {boolean}
 */
export function isAndroidError() {
  return !(SYSTEM_CHECKS.ANDROID_HOME.check && SYSTEM_CHECKS.ADB.check);
}

/**
 * Check if there is an iOS error
 *
 * @returns {boolean}
 */
export function isIOSError() {
  return isMac() && !SYSTEM_CHECKS.XCODE.check;
}

/**
 * Some helpers
 */

/**
 * Verify if all environment variables are set
 *
 * @param {string} varName
 *
 * @returns {
 *    {
 *      check: boolean,
 *      message: string
 *    }
 * }
 */
function EnvVarAndPathCheck(varName) {
  const varValue = remote.process.env[varName];

  if (typeof varValue === 'undefined') {
    return {
      name: varName,
      check: false,
      message: `${varName} is NOT set!`
    };
  }

  return existsSync(varValue)
    ? {
        name: varName,
        check: true,
        message: `Set to: ${varValue}`
      }
    : {
        name: varName,
        check: false,
        message: `Set to '${varValue}' but this is NOT a valid path!`
      };
}

/**
 * Check the Android tools
 *
 * @param {string} toolName
 * @param {string} toolPath
 *
 * @returns {
 *    {
 *      check: boolean,
 *      message: string
 *    }
 * }
 */
function AndroidToolCheck(toolName, toolPath) {
  if (typeof remote.process.env.ANDROID_HOME === 'undefined') {
    return {
      name: 'ANDROID_HOME',
      check: false,
      message: `Could not be found because it is NOT set!`
    };
  }

  const fullPath = resolve(remote.process.env.ANDROID_HOME, toolPath);

  return existsSync(fullPath)
    ? {
        name: toolName,
        check: true,
        message: `Exists at: ${fullPath}`
      }
    : {
        name: toolName,
        check: false,
        message: `Could NOT be found at '${fullPath}'!`
      };
}

/**
 * Check if XCODE is installed
 *
 * @returns {
 *    {
 *      check: boolean,
 *      message: string
 *    }
 * }
 */
function XcodeCheck() {
  let xcodePath;
  try {
    spawnSync('xcrun', ['simctl', 'help']);

    const { stdout } = spawnSync('xcode-select', ['-p']);
    xcodePath = (stdout.toString() || '').replace('\n', '');
  } catch (err) {
    return {
      name: 'XCODE',
      check: false,
      message: 'NOT installed!'
    };
  }
  return xcodePath && existsSync(xcodePath)
    ? {
        name: 'XCODE',
        check: true,
        message: `Installed at: ${xcodePath}`
      }
    : {
        name: 'XCODE',
        check: false,
        message: `Cannot be found at '${xcodePath}'!`
      };
}
