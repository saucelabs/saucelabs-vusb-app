import { remote } from 'electron';
import { platform } from 'os';
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import { spawnSync } from 'child_process';

type CheckType = {
  check: boolean;
  isOSX?: boolean;
  label: string;
  message: string;
  name: string;
};

/**
 * Verify if all environment variables are set
 */
function EnvVarAndPathCheck(varName: string): CheckType {
  const varValue = remote.process.env[varName];
  const label = `Set ${varName}`;

  if (typeof varValue === 'undefined') {
    return {
      check: false,
      label,
      message: `${varName} is NOT set!`,
      name: varName,
    };
  }

  return existsSync(varValue)
    ? {
        check: true,
        label,
        message: `Set to: ${varValue}`,
        name: varName,
      }
    : {
        check: false,
        label,
        message: `Set to '${varValue}' but this is NOT a valid path!`,
        name: varName,
      };
}

/**
 * Check if platform is Linux
 */
function isLinux(): boolean {
  return platform().toLowerCase() === 'linux';
}

/**
 * Check if platform is OSX
 */
function isMac(): boolean {
  return platform().toLowerCase() === 'darwin';
}

/**
 * Check if platform is Windows
 */
function isWindows(): boolean {
  return platform().toLowerCase() === 'win32';
}

/**
 * Check the Android tools
 */
function AndroidToolCheck(toolName: string, toolPath: string): CheckType {
  const label = toolName.toUpperCase();

  if (typeof remote.process.env.ANDROID_HOME === 'undefined') {
    return {
      check: false,
      label,
      message: `Could not be found because it is NOT set!`,
      name: 'ANDROID_HOME',
    };
  }

  const fullPath = resolve(remote.process.env.ANDROID_HOME, toolPath);

  return existsSync(fullPath)
    ? {
        check: true,
        label,
        message: `Exists at: ${fullPath}`,
        name: toolName,
      }
    : {
        check: false,
        label,
        message: `Could NOT be found at '${fullPath}'!`,
        name: toolName,
      };
}

/**
 * Check if XCODE is installed
 */
function XcodeCheck(): CheckType {
  let xcodePath;
  const label = 'XCODE';
  const isOSX = isMac();

  try {
    spawnSync('xcrun', ['simctl', 'help']);

    const { stdout } = spawnSync('xcode-select', ['-p']);
    xcodePath = (stdout.toString() || '').replace('\n', '');
  } catch (err) {
    return {
      check: false,
      isOSX,
      label,
      message: 'NOT installed!',
      name: label,
    };
  }

  return xcodePath && existsSync(xcodePath)
    ? {
        check: true,
        isOSX,
        label,
        message: `Installed at: ${xcodePath}`,
        name: label,
      }
    : {
        check: false,
        isOSX,
        label,
        message: `Cannot be found at '${xcodePath}'!`,
        name: label,
      };
}

const SYSTEM_CHECKS = {
  JAVA_HOME: {
    ...EnvVarAndPathCheck('JAVA_HOME'),
  },
  ANDROID_HOME: {
    ...EnvVarAndPathCheck('ANDROID_HOME'),
  },
  ADB: {
    ...AndroidToolCheck(
      'adb',
      join('platform-tools', isWindows() ? 'adb.exe' : 'adb')
    ),
  },
  XCODE: {
    ...(isMac()
      ? XcodeCheck()
      : {
          check: false,
          isOSX: isMac(),
          label: 'XCODE',
          message: `${
            isLinux() ? 'Linux' : 'Windows'
          } does not support Virtual USB for iOS`,
          name: 'XCODE',
        }),
  },
};

/**
 * Check if there is an Android error
 */
function isAndroidError(): boolean {
  return !(SYSTEM_CHECKS.ANDROID_HOME.check && SYSTEM_CHECKS.ADB.check);
}

/**
 * Check if there is an iOS error
 *
 * @returns {boolean}
 */
function isIOSError(): boolean {
  return isMac() && !SYSTEM_CHECKS.XCODE.check;
}

export { isAndroidError, isIOSError, isLinux, isMac, isWindows, SYSTEM_CHECKS };
