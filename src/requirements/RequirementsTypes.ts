type SystemDataCheckType = {
  check: boolean;
  isOSX?: boolean;
  label: string;
  message: string;
  name: string;
};

interface SystemChecksInterface {
  ADB: SystemDataCheckType;
  ANDROID_HOME: SystemDataCheckType;
  JAVA_HOME: SystemDataCheckType;
  XCODE: SystemDataCheckType;
}

export { SystemChecksInterface, SystemDataCheckType };
