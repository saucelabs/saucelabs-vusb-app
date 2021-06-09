type MenuItemType = {
  route: string;
  iconClass: string;
  label: string;
};
type ServerButtonsType = {
  afterComponent?: JSX.Element;
  disableShowMonitor?: boolean;
  serverError: boolean;
  serverStatus: string;
  startVusbServer: () => void;
  stopVusbServer: () => void;
  toggleVusbServerMonitor: () => void;
};
type ServerHeaderType = {
  centerComponent?: JSX.Element;
  serverError: boolean;
  serverStatus: string;
  rightComponent: JSX.Element;
};
type ServerMonitorType = {
  clearLogs: () => void;
  headerCenterComponent?: JSX.Element;
  headerRightComponent: JSX.Element;
  logLines: string[];
  serverError: boolean;
  serverStatus: string;
};
type TerminalType = {
  clearLogs: () => void;
  logLines: string[];
};
type VusbMonitorType = {
  clearLogs: () => void;
  logLines: string[];
  serverError: boolean;
  serverStatus: string;
  startVusbServer: () => void;
  stopVusbServer: () => void;
  toggleVusbServerMonitor: () => void;
};

export {
  MenuItemType,
  ServerButtonsType,
  ServerHeaderType,
  ServerMonitorType,
  TerminalType,
  VusbMonitorType,
};
