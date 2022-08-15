import { SystemChecksAction, SystemChecksType } from 'types/SystemChecksTypes';

/**
 * Get the system check data
 */
function getSystemCheckData(data: {
  isAndroidError: boolean;
  isIOSError: boolean;
  isSystemOperational: boolean;
  isLinux: boolean;
  isMac: boolean;
  isWindows: boolean;
  systemChecks: SystemChecksType;
}) {
  return {
    data,
    type: SystemChecksAction.GET_SYSTEM_CHECKS_DATA,
  };
}

// eslint-disable-next-line import/prefer-default-export
export { getSystemCheckData };
