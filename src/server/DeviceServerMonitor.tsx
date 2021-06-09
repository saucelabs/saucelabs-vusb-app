import React from 'react';
import CloseIcon from '../components/CloseIcon';
import ServerMonitor from './components/ServerMonitor';
import Styles from './DeviceServerMonitor.module.css';

type DeviceServerMonitorType = {
  clearLogs: (arg: string) => void;
  device: string;
  deviceID: string;
  logLines: string[];
  serverError: boolean;
  serverStatus: string;
  showLogs: boolean;
  toggleDeviceLogs: (deviceId: string, showLogs: boolean) => void;
};

const DeviceServerMonitor: React.FC<DeviceServerMonitorType> = ({
  clearLogs,
  device,
  deviceID,
  logLines,
  serverError,
  serverStatus,
  showLogs,
  toggleDeviceLogs,
}) => {
  return (
    <ServerMonitor
      clearLogs={() => clearLogs(deviceID)}
      headerCenterComponent={<span className={Styles.device}>{device}</span>}
      headerRightComponent={
        <CloseIcon onClick={() => toggleDeviceLogs(deviceID, showLogs)} />
      }
      logLines={logLines}
      serverError={serverError}
      serverStatus={serverStatus}
    />
  );
};

export default DeviceServerMonitor;
