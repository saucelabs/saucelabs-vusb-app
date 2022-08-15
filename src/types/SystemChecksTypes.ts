enum SystemChecksAction {
  GET_SYSTEM_CHECKS_DATA = 'GET_SYSTEM_CHECKS_DATA',
}

type SystemDataCheckType = {
  check: boolean;
  isOSX?: boolean;
  label: string;
  message: string;
  name: string;
};

type SystemChecksType = {
  ADB: SystemDataCheckType;
  ANDROID_HOME: SystemDataCheckType;
  JAVA_HOME: SystemDataCheckType;
  XCODE: SystemDataCheckType;
};

type SystemChecksStateType = {
  isAndroidError: boolean;
  isIOSError: boolean;
  isSystemOperational: boolean;
  isLinux: boolean;
  isMac: boolean;
  isWindows: boolean;
  systemChecks: SystemChecksType;
};

type SystemChecksActionType = {
  type: SystemChecksAction.GET_SYSTEM_CHECKS_DATA;
  data: SystemChecksStateType;
};

export {
  SystemChecksAction,
  SystemChecksActionType,
  SystemChecksStateType,
  SystemChecksType,
  SystemDataCheckType,
};
