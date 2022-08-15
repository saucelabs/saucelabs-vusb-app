import {
  SystemChecksAction as ACTIONS,
  SystemChecksActionType,
  SystemChecksStateType,
} from 'types/SystemChecksTypes';

const initialSystemChecksState: SystemChecksStateType = {
  isAndroidError: false,
  isIOSError: false,
  isSystemOperational: false,
  isLinux: false,
  isMac: false,
  isWindows: false,
  systemChecks: {
    ADB: {
      check: false,
      isOSX: false,
      label: 'ADB',
      message: 'string',
      name: 'string',
    },
    ANDROID_HOME: {
      check: false,
      isOSX: false,
      label: 'Set ANDROID_HOME',
      message: 'string',
      name: 'string',
    },
    JAVA_HOME: {
      check: false,
      isOSX: false,
      label: 'Set JAVA_HOME',
      message: 'string',
      name: 'string',
    },
    XCODE: {
      check: false,
      isOSX: false,
      label: 'XCODE',
      message: 'string',
      name: 'string',
    },
  },
};
const systemChecksReducer = (
  state: SystemChecksStateType = initialSystemChecksState,
  action: SystemChecksActionType
) => {
  switch (action.type) {
    case ACTIONS.GET_SYSTEM_CHECKS_DATA:
      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
};

export { initialSystemChecksState, systemChecksReducer };
