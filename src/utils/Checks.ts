import { remote } from 'electron';
import { platform } from 'os';
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import { spawnSync } from 'child_process';

type CheckType = {
  name: string;
  check: boolean;
  message: string;
};

/**
 * Verify if all environment variables are set
 */
function EnvVarAndPathCheck(varName: string): CheckType {
  const varValue = remote.process.env[varName];

  if (typeof varValue === 'undefined') {
    return {
      name: varName,
      check: false,
      message: `${varName} is NOT set!`,
    };
  }

  return existsSync(varValue)
    ? {
        name: varName,
        check: true,
        message: `Set to: ${varValue}`,
      }
    : {
        name: varName,
        check: false,
        message: `Set to '${varValue}' but this is NOT a valid path!`,
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
 * Check the Android tools
 */
function AndroidToolCheck(toolName: string, toolPath: string): CheckType {
  if (typeof remote.process.env.ANDROID_HOME === 'undefined') {
    return {
      name: 'ANDROID_HOME',
      check: false,
      message: `Could not be found because it is NOT set!`,
    };
  }

  const fullPath = resolve(remote.process.env.ANDROID_HOME, toolPath);

  return existsSync(fullPath)
    ? {
        name: toolName,
        check: true,
        message: `Exists at: ${fullPath}`,
      }
    : {
        name: toolName,
        check: false,
        message: `Could NOT be found at '${fullPath}'!`,
      };
}

/**
 * Check if XCODE is installed
 */
function XcodeCheck(): CheckType {
  let xcodePath;
  try {
    spawnSync('xcrun', ['simctl', 'help']);

    const { stdout } = spawnSync('xcode-select', ['-p']);
    xcodePath = (stdout.toString() || '').replace('\n', '');
  } catch (err) {
    return {
      name: 'XCODE',
      check: false,
      message: 'NOT installed!',
    };
  }

  return xcodePath && existsSync(xcodePath)
    ? {
        name: 'XCODE',
        check: true,
        message: `Installed at: ${xcodePath}`,
      }
    : {
        name: 'XCODE',
        check: false,
        message: `Cannot be found at '${xcodePath}'!`,
      };
}

/**
 * Check if platform is Windows
 */
function isWindows(): boolean {
  return platform().toLowerCase() === 'win32';
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
          message: `${
            isLinux() ? 'Linux' : 'Windows'
          } does not support Virtual USB for iOS`,
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
