/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { ToggleLogsType } from 'types/DeviceTypes';
import CloseIconButton from '../buttons/CloseIconButton';
import ServerMonitor from '../server/ServerMonitor';
import Styles from './DeviceServerMonitor.module.css';

interface DeviceServerMonitorInterface {
  clearLogs: (arg: string) => void;
  device: string;
  descriptorId: string;
  logLines: string[];
  serverError: boolean;
  serverStatus: string;
  showLogs: boolean;
  toggleDeviceLogs: ({ descriptorId, showLogs }: ToggleLogsType) => void;
}

const DeviceServerMonitor: React.FC<DeviceServerMonitorInterface> = ({
  clearLogs,
  device,
  descriptorId,
  logLines,
  serverError,
  serverStatus,
  showLogs,
  toggleDeviceLogs,
}) => {
  return (
    <ServerMonitor
      clearLogs={() => clearLogs(descriptorId)}
      headerCenterComponent={<span className={Styles.device}>{device}</span>}
      headerRightComponent={
        <div
          onClick={() => {
            toggleDeviceLogs({ descriptorId, showLogs });
          }}
        >
          <CloseIconButton />
        </div>
      }
      logLines={logLines}
      serverError={serverError}
      serverStatus={serverStatus}
    />
  );
};

export default DeviceServerMonitor;
