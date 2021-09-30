enum RequirementsAction {
  REQUIREMENTS_OPEN = 'REQUIREMENTS_OPEN',
  REQUIREMENTS_ERROR = 'REQUIREMENTS_ERROR',
}

type SystemDataCheckType = {
  check: boolean;
  isOSX?: boolean;
  label: string;
  message: string;
  name: string;
};

type RequirementsActionType =
  | { type: RequirementsAction.REQUIREMENTS_OPEN }
  | { type: RequirementsAction.REQUIREMENTS_ERROR; isError: boolean };

interface SystemChecksInterface {
  ADB: SystemDataCheckType;
  ANDROID_HOME: SystemDataCheckType;
  JAVA_HOME: SystemDataCheckType;
  XCODE: SystemDataCheckType;
}

export {
  RequirementsAction,
  RequirementsActionType,
  SystemChecksInterface,
  SystemDataCheckType,
};
